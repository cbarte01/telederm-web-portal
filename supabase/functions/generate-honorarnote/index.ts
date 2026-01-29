import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-HONORARNOTE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("Missing authorization header");
      throw new Error("Unauthorized");
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);
    if (userError) {
      logStep("Authentication error", { error: userError.message });
      throw new Error("Unauthorized");
    }
    
    const user = userData.user;
    if (!user) {
      logStep("No user found");
      throw new Error("Unauthorized");
    }
    logStep("User authenticated", { userId: user.id });

    // Parse request body
    const { consultation_id } = await req.json();
    if (!consultation_id) {
      logStep("Missing consultation_id");
      throw new Error("Invalid request");
    }

    // Validate consultation_id is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(consultation_id)) {
      logStep("Invalid consultation_id format", { consultation_id });
      throw new Error("Invalid request");
    }

    logStep("Generating for consultation", { consultation_id });

    // Fetch consultation with patient profile including address
    const { data: consultation, error: consultationError } = await supabaseClient
      .from("consultations")
      .select(`
        *,
        patient:profiles!consultations_patient_id_fkey(
          full_name,
          date_of_birth,
          social_security_number,
          patient_address_street,
          patient_address_zip,
          patient_address_city,
          insurance_provider
        )
      `)
      .eq("id", consultation_id)
      .single();

    if (consultationError || !consultation) {
      logStep("Consultation not found", { error: consultationError?.message });
      throw new Error("Resource not found");
    }

    // Verify user is either the patient OR the assigned doctor
    const isPatient = consultation.patient_id === user.id;
    const isAssignedDoctor = consultation.doctor_id === user.id;
    
    if (!isPatient && !isAssignedDoctor) {
      logStep("Unauthorized access attempt", { user_id: user.id, patient_id: consultation.patient_id, doctor_id: consultation.doctor_id });
      throw new Error("Access denied");
    }

    // Verify consultation is completed with ICD-10 code
    if (consultation.status !== "completed") {
      logStep("Consultation not completed", { status: consultation.status });
      throw new Error("Document not available");
    }

    if (!consultation.icd10_code) {
      logStep("Missing ICD-10 code", { consultation_id });
      throw new Error("Document not available");
    }

    logStep("Consultation fetched", { 
      status: consultation.status, 
      icd10: consultation.icd10_code,
      doctor_id: consultation.doctor_id 
    });

    // Fetch doctor profile with billing info, signature, and logo
    const { data: doctorProfile, error: doctorError } = await supabaseClient
      .from("profiles")
      .select(`
        full_name, 
        practice_name, 
        practice_address_street, 
        practice_address_zip, 
        practice_address_city, 
        uid_number, 
        iban, 
        bic,
        billing_name,
        billing_email,
        billing_phone,
        signature_url,
        practice_logo_url,
        phone
      `)
      .eq("id", consultation.doctor_id)
      .single();

    if (doctorError || !doctorProfile) {
      logStep("Doctor profile not found", { error: doctorError?.message });
      throw new Error("Resource not found");
    }

    logStep("Doctor profile fetched", { 
      name: doctorProfile.full_name,
      hasUID: !!doctorProfile.uid_number,
      hasSignature: !!doctorProfile.signature_url,
      hasLogo: !!doctorProfile.practice_logo_url
    });

    // Generate or retrieve sequential honorarnote number
    let honorarnoteNumber = consultation.honorarnote_number;
    
    if (!honorarnoteNumber) {
      const currentYear = new Date().getFullYear();
      const shortYear = String(currentYear).slice(-2);
      
      // Upsert counter for current year and get new number
      const { data: counterData, error: counterError } = await supabaseClient
        .from("honorarnote_counter")
        .upsert(
          { year: currentYear, last_number: 1 },
          { onConflict: "year" }
        )
        .select()
        .single();

      if (counterError) {
        // If upsert fails, try to increment existing
        const { data: updatedCounter, error: updateError } = await supabaseClient
          .rpc("increment_honorarnote_counter", { p_year: currentYear });
        
        if (updateError) {
          logStep("Failed to generate honorarnote number", { error: updateError.message });
          throw new Error("Failed to generate document");
        }
        honorarnoteNumber = `RechNR//${shortYear}/${String(updatedCounter).padStart(3, "0")}`;
      } else {
        // Increment the counter
        const newNumber = (counterData?.last_number || 0) + 1;
        await supabaseClient
          .from("honorarnote_counter")
          .update({ last_number: newNumber })
          .eq("year", currentYear);
        
        honorarnoteNumber = `RechNR//${shortYear}/${String(newNumber).padStart(3, "0")}`;
      }

      // Store the number in the consultation
      await supabaseClient
        .from("consultations")
        .update({ honorarnote_number: honorarnoteNumber })
        .eq("id", consultation_id);
    }

    logStep("Honorarnote number", { honorarnoteNumber });

    // Fetch signature image if exists
    let signatureImageBytes: Uint8Array | null = null;
    if (doctorProfile.signature_url) {
      try {
        const { data: signatureData, error: signatureError } = await supabaseClient.storage
          .from("doctor-signatures")
          .download(doctorProfile.signature_url);
        
        if (!signatureError && signatureData) {
          signatureImageBytes = new Uint8Array(await signatureData.arrayBuffer());
          logStep("Signature loaded", { size: signatureImageBytes.length });
        }
      } catch (sigError) {
        logStep("Signature load warning", { error: String(sigError) });
      }
    }

    // Fetch practice logo if exists
    let logoImageBytes: Uint8Array | null = null;
    if (doctorProfile.practice_logo_url) {
      try {
        const { data: logoData, error: logoError } = await supabaseClient.storage
          .from("practice-logos")
          .download(doctorProfile.practice_logo_url);
        
        if (!logoError && logoData) {
          logoImageBytes = new Uint8Array(await logoData.arrayBuffer());
          logStep("Logo loaded", { size: logoImageBytes.length });
        }
      } catch (logoErr) {
        logStep("Logo load warning", { error: String(logoErr) });
      }
    }

    // Create PDF - A4 size
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const black = rgb(0, 0, 0);
    const gray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.85, 0.85, 0.85);

    const leftMargin = 50;
    const rightMargin = width - 50;

    // Current date for the document
    const billDate = consultation.responded_at 
      ? new Date(consultation.responded_at)
      : new Date();
    
    const serviceDate = consultation.submitted_at
      ? new Date(consultation.submitted_at)
      : billDate;
    
    const formatDate = (date: Date) => date.toLocaleDateString("de-AT", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric"
    });

    // ============= HEADER SECTION =============
    let y = height - 50;

    // Patient Info (left side)
    let patientInfoY = y;
    const patientName = consultation.patient?.full_name || "N/A";
    
    page.drawText(patientName, {
      x: leftMargin,
      y: patientInfoY,
      size: 10,
      font: helveticaBold,
      color: black,
    });
    patientInfoY -= 14;

    // Patient street
    if (consultation.patient?.patient_address_street) {
      page.drawText(consultation.patient.patient_address_street, {
        x: leftMargin,
        y: patientInfoY,
        size: 10,
        font: helvetica,
        color: black,
      });
      patientInfoY -= 14;
    }

    // Patient zip + city
    const patientCityLine = [
      consultation.patient?.patient_address_zip,
      consultation.patient?.patient_address_city
    ].filter(Boolean).join(" ");
    
    if (patientCityLine) {
      page.drawText(patientCityLine, {
        x: leftMargin,
        y: patientInfoY,
        size: 10,
        font: helvetica,
        color: black,
      });
      patientInfoY -= 14;
    }

    // Country (Austria)
    page.drawText("Österreich", {
      x: leftMargin,
      y: patientInfoY,
      size: 10,
      font: helvetica,
      color: black,
    });

    // Doctor Info (right side)
    const doctorInfoX = 350;
    let doctorInfoY = y;

    const doctorDisplayName = doctorProfile.billing_name || doctorProfile.full_name || "Dr.";
    page.drawText(doctorDisplayName, {
      x: doctorInfoX,
      y: doctorInfoY,
      size: 10,
      font: helveticaBold,
      color: black,
    });
    doctorInfoY -= 14;

    // Practice address street
    if (doctorProfile.practice_address_street) {
      page.drawText(doctorProfile.practice_address_street, {
        x: doctorInfoX,
        y: doctorInfoY,
        size: 10,
        font: helvetica,
        color: black,
      });
      doctorInfoY -= 14;
    }

    // Practice zip + city
    const doctorCityLine = [
      doctorProfile.practice_address_zip,
      doctorProfile.practice_address_city
    ].filter(Boolean).join(" ");
    
    if (doctorCityLine) {
      page.drawText(doctorCityLine, {
        x: doctorInfoX,
        y: doctorInfoY,
        size: 10,
        font: helvetica,
        color: black,
      });
      doctorInfoY -= 14;
    }

    // Country (Austria)
    page.drawText("Österreich", {
      x: doctorInfoX,
      y: doctorInfoY,
      size: 10,
      font: helvetica,
      color: black,
    });

    // ============= TITLE SECTION =============
    y = height - 140;
    
    // Horizontal line
    page.drawLine({
      start: { x: leftMargin, y: y },
      end: { x: rightMargin, y: y },
      thickness: 0.5,
      color: lightGray,
    });
    
    y -= 30;

    // Title: "HONORARNOTE"
    const titleText = "HONORARNOTE";
    const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 16);
    page.drawText(titleText, {
      x: (width - titleWidth) / 2,
      y: y,
      size: 16,
      font: helveticaBold,
      color: black,
    });

    y -= 18;

    // Subtitle
    const subtitleText = "Zur Vorlage bei Versicherung";
    const subtitleWidth = helvetica.widthOfTextAtSize(subtitleText, 10);
    page.drawText(subtitleText, {
      x: (width - subtitleWidth) / 2,
      y: y,
      size: 10,
      font: helvetica,
      color: gray,
    });

    y -= 30;

    // ============= BILLING METADATA SECTION =============
    page.drawLine({
      start: { x: leftMargin, y: y },
      end: { x: rightMargin, y: y },
      thickness: 0.5,
      color: lightGray,
    });
    
    y -= 20;

    page.drawText(`Rechnungsnummer:`, {
      x: leftMargin,
      y: y,
      size: 9,
      font: helvetica,
      color: gray,
    });
    page.drawText(honorarnoteNumber || "N/A", {
      x: leftMargin + 100,
      y: y,
      size: 9,
      font: helveticaBold,
      color: black,
    });

    page.drawText("Original", {
      x: rightMargin - 40,
      y: y,
      size: 9,
      font: helveticaBold,
      color: black,
    });

    y -= 14;

    page.drawText(`Rechnungsdatum:`, {
      x: leftMargin,
      y: y,
      size: 9,
      font: helvetica,
      color: gray,
    });
    page.drawText(formatDate(billDate), {
      x: leftMargin + 100,
      y: y,
      size: 9,
      font: helvetica,
      color: black,
    });

    y -= 14;

    page.drawText(`Leistungsdatum:`, {
      x: leftMargin,
      y: y,
      size: 9,
      font: helvetica,
      color: gray,
    });
    page.drawText(formatDate(serviceDate), {
      x: leftMargin + 100,
      y: y,
      size: 9,
      font: helvetica,
      color: black,
    });

    y -= 30;

    // ============= PATIENT SECTION =============
    page.drawLine({
      start: { x: leftMargin, y: y },
      end: { x: rightMargin, y: y },
      thickness: 0.5,
      color: lightGray,
    });
    
    y -= 20;

    page.drawText("PATIENT", {
      x: leftMargin,
      y: y,
      size: 11,
      font: helveticaBold,
      color: black,
    });

    y -= 18;

    // Patient Name (use patientName from header)
    page.drawText("Name:", {
      x: leftMargin,
      y: y,
      size: 9,
      font: helvetica,
      color: gray,
    });
    page.drawText(patientName, {
      x: leftMargin + 80,
      y: y,
      size: 9,
      font: helveticaBold,
      color: black,
    });

    y -= 14;

    // Date of Birth
    if (consultation.patient?.date_of_birth) {
      const dob = new Date(consultation.patient.date_of_birth);
      page.drawText("Geburtsdatum:", {
        x: leftMargin,
        y: y,
        size: 9,
        font: helvetica,
        color: gray,
      });
      page.drawText(formatDate(dob), {
        x: leftMargin + 80,
        y: y,
        size: 9,
        font: helvetica,
        color: black,
      });
      y -= 14;
    }

    // Insurance Number (first 4 digits)
    if (consultation.patient?.social_security_number) {
      const svNr = consultation.patient.social_security_number.slice(0, 4);
      page.drawText("Vers.Nr:", {
        x: leftMargin,
        y: y,
        size: 9,
        font: helvetica,
        color: gray,
      });
      page.drawText(svNr, {
        x: leftMargin + 80,
        y: y,
        size: 9,
        font: helvetica,
        color: black,
      });
      y -= 14;
    }

    // Patient Address
    const patientAddress = [
      consultation.patient?.patient_address_street,
      [consultation.patient?.patient_address_zip, consultation.patient?.patient_address_city].filter(Boolean).join(" ")
    ].filter(Boolean).join(", ");

    if (patientAddress) {
      page.drawText("Anschrift:", {
        x: leftMargin,
        y: y,
        size: 9,
        font: helvetica,
        color: gray,
      });
      page.drawText(patientAddress, {
        x: leftMargin + 80,
        y: y,
        size: 9,
        font: helvetica,
        color: black,
      });
      y -= 14;
    }

    // Insurance Provider
    if (consultation.patient?.insurance_provider) {
      page.drawText("Versicherung:", {
        x: leftMargin,
        y: y,
        size: 9,
        font: helvetica,
        color: gray,
      });
      page.drawText(consultation.patient.insurance_provider, {
        x: leftMargin + 80,
        y: y,
        size: 9,
        font: helvetica,
        color: black,
      });
      y -= 14;
    }

    y -= 20;

    // ============= SERVICES TABLE =============
    page.drawLine({
      start: { x: leftMargin, y: y },
      end: { x: rightMargin, y: y },
      thickness: 0.5,
      color: lightGray,
    });
    
    y -= 20;

    page.drawText("ERBRACHTE LEISTUNGEN", {
      x: leftMargin,
      y: y,
      size: 11,
      font: helveticaBold,
      color: black,
    });

    y -= 25;

    // Table header
    const tableTop = y + 5;
    const colDate = leftMargin;
    const colDesc = leftMargin + 80;
    const colAmount = rightMargin - 80;
    
    // Header row background
    page.drawRectangle({
      x: leftMargin,
      y: y - 15,
      width: rightMargin - leftMargin,
      height: 20,
      color: lightGray,
    });

    page.drawText("Datum", {
      x: colDate + 5,
      y: y - 10,
      size: 9,
      font: helveticaBold,
      color: black,
    });
    page.drawText("Beschreibung", {
      x: colDesc,
      y: y - 10,
      size: 9,
      font: helveticaBold,
      color: black,
    });
    page.drawText("Betrag", {
      x: colAmount + 15,
      y: y - 10,
      size: 9,
      font: helveticaBold,
      color: black,
    });

    y -= 35;

    // Service row
    page.drawText(formatDate(serviceDate), {
      x: colDate + 5,
      y: y,
      size: 9,
      font: helvetica,
      color: black,
    });

    // Service description with ICD-10
    const serviceDesc = "Telemedizinische Konsultation";
    page.drawText(serviceDesc, {
      x: colDesc,
      y: y,
      size: 9,
      font: helvetica,
      color: black,
    });

    const amount = consultation.consultation_price || (consultation.pricing_plan === "urgent" ? 74 : 49);
    page.drawText(`€ ${amount.toFixed(2).replace(".", ",")}`, {
      x: colAmount + 10,
      y: y,
      size: 9,
      font: helveticaBold,
      color: black,
    });

    y -= 14;

    page.drawText("(Dermatologie)", {
      x: colDesc,
      y: y,
      size: 9,
      font: helvetica,
      color: gray,
    });

    y -= 14;

    // ICD-10 code and description
    const icd10Text = `ICD-10: ${consultation.icd10_code}`;
    page.drawText(icd10Text, {
      x: colDesc,
      y: y,
      size: 9,
      font: helvetica,
      color: black,
    });

    y -= 14;

    if (consultation.icd10_description) {
      const diagDesc = consultation.icd10_description.length > 50 
        ? consultation.icd10_description.substring(0, 47) + "..." 
        : consultation.icd10_description;
      page.drawText(diagDesc, {
        x: colDesc,
        y: y,
        size: 8,
        font: helvetica,
        color: gray,
      });
      y -= 14;
    }

    y -= 10;

    // Totals row
    page.drawLine({
      start: { x: colAmount - 30, y: y },
      end: { x: rightMargin, y: y },
      thickness: 0.5,
      color: black,
    });

    y -= 18;

    page.drawText("Gesamt:", {
      x: colAmount - 25,
      y: y,
      size: 10,
      font: helveticaBold,
      color: black,
    });
    page.drawText(`€ ${amount.toFixed(2).replace(".", ",")}`, {
      x: colAmount + 10,
      y: y,
      size: 10,
      font: helveticaBold,
      color: black,
    });

    y -= 30;

    // Tax exemption note
    page.drawText("Umsatzsteuerbefreit gemäß § 6 Abs. 1 Z 19 UStG (Heilbehandlung)", {
      x: leftMargin,
      y: y,
      size: 8,
      font: helvetica,
      color: gray,
    });

    y -= 30;

    // ============= PAYMENT SECTION =============
    page.drawLine({
      start: { x: leftMargin, y: y },
      end: { x: rightMargin, y: y },
      thickness: 0.5,
      color: lightGray,
    });
    
    y -= 20;

    page.drawText("ZAHLUNGSINFORMATION", {
      x: leftMargin,
      y: y,
      size: 11,
      font: helveticaBold,
      color: black,
    });

    y -= 18;

    page.drawText(`Betrag bereits beglichen am: ${formatDate(billDate)}`, {
      x: leftMargin,
      y: y,
      size: 9,
      font: helvetica,
      color: black,
    });

    y -= 14;

    page.drawText("Zahlungsart: Kreditkarte (Online)", {
      x: leftMargin,
      y: y,
      size: 9,
      font: helvetica,
      color: black,
    });

    y -= 20;

    // Bank details
    if (doctorProfile.iban || doctorProfile.bic) {
      page.drawText("Bankverbindung für Rückfragen:", {
        x: leftMargin,
        y: y,
        size: 9,
        font: helvetica,
        color: gray,
      });
      y -= 14;

      if (doctorProfile.iban) {
        page.drawText(`IBAN: ${doctorProfile.iban}`, {
          x: leftMargin,
          y: y,
          size: 9,
          font: helvetica,
          color: black,
        });
        y -= 14;
      }

      if (doctorProfile.bic) {
        page.drawText(`BIC: ${doctorProfile.bic}`, {
          x: leftMargin,
          y: y,
          size: 9,
          font: helvetica,
          color: black,
        });
      }
    }

    // ============= FOOTER: Doctor Info + Signature (right side) =============
    const footerY = 150;
    const footerX = rightMargin - 200;

    // Doctor info on right side of footer
    let footerInfoY = footerY;
    
    page.drawText(doctorDisplayName, {
      x: footerX,
      y: footerInfoY,
      size: 10,
      font: helveticaBold,
      color: black,
    });
    footerInfoY -= 14;

    // Practice street
    if (doctorProfile.practice_address_street) {
      page.drawText(doctorProfile.practice_address_street, {
        x: footerX,
        y: footerInfoY,
        size: 9,
        font: helvetica,
        color: black,
      });
      footerInfoY -= 12;
    }

    // Practice zip + city
    if (doctorCityLine) {
      page.drawText(doctorCityLine, {
        x: footerX,
        y: footerInfoY,
        size: 9,
        font: helvetica,
        color: black,
      });
      footerInfoY -= 12;
    }

    // Country
    page.drawText("Österreich", {
      x: footerX,
      y: footerInfoY,
      size: 9,
      font: helvetica,
      color: black,
    });
    footerInfoY -= 20;

    // Signature (right-aligned, below doctor info)
    if (signatureImageBytes) {
      try {
        let signatureImage;
        if (signatureImageBytes[0] === 0x89 && signatureImageBytes[1] === 0x50) {
          signatureImage = await pdfDoc.embedPng(signatureImageBytes);
        } else {
          signatureImage = await pdfDoc.embedJpg(signatureImageBytes);
        }
        
        // Scale signature to fit
        const sigDims = signatureImage.scale(0.5);
        const maxSigWidth = 150;
        const maxSigHeight = 60;
        let sigWidth = sigDims.width;
        let sigHeight = sigDims.height;
        
        if (sigWidth > maxSigWidth) {
          const scale = maxSigWidth / sigWidth;
          sigWidth = maxSigWidth;
          sigHeight = sigHeight * scale;
        }
        if (sigHeight > maxSigHeight) {
          const scale = maxSigHeight / sigHeight;
          sigHeight = maxSigHeight;
          sigWidth = sigWidth * scale;
        }

        // Position signature on right side below doctor info
        page.drawImage(signatureImage, {
          x: footerX,
          y: footerInfoY - sigHeight,
          width: sigWidth,
          height: sigHeight,
        });
        
        logStep("Signature embedded in PDF");
      } catch (embedError) {
        logStep("Signature embed warning", { error: String(embedError) });
      }
    }

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    logStep("PDF generated", { size: pdfBytes.length });

    // Upload to storage
    const storagePath = `${user.id}/${consultation_id}/honorarnote_${honorarnoteNumber?.replace(/\//g, "-") || "draft"}.pdf`;
    
    const { error: uploadError } = await supabaseClient.storage
      .from("honorarnoten")
      .upload(storagePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      logStep("Upload error", { error: uploadError.message });
      throw new Error("Failed to generate document");
    }

    // Update consultation with storage path
    await supabaseClient
      .from("consultations")
      .update({ honorarnote_storage_path: storagePath })
      .eq("id", consultation_id);

    // Generate signed URL
    const { data: signedUrlData, error: signedUrlError } = await supabaseClient.storage
      .from("honorarnoten")
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (signedUrlError) {
      throw new Error("Failed to generate document");
    }

    logStep("Honorarnote generated successfully", { storagePath });

    return new Response(JSON.stringify({ 
      url: signedUrlData.signedUrl,
      honorarnote_number: honorarnoteNumber,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    // Return safe error messages to client
    const safeErrors = ["Unauthorized", "Invalid request", "Resource not found", "Access denied", "Document not available", "Failed to generate document"];
    const clientMessage = safeErrors.includes(errorMessage) ? errorMessage : "Failed to generate document";
    const statusCode = errorMessage === "Unauthorized" ? 401 : 
                       errorMessage === "Access denied" ? 403 :
                       errorMessage === "Resource not found" || errorMessage === "Document not available" ? 404 : 500;
    return new Response(JSON.stringify({ error: clientMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: statusCode,
    });
  }
});
