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
    if (!authHeader) throw new Error("No authorization header provided");

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Parse request body
    const { consultation_id } = await req.json();
    if (!consultation_id) {
      throw new Error("consultation_id is required");
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
      throw new Error(`Consultation not found: ${consultationError?.message}`);
    }

    // Verify user is either the patient OR the assigned doctor
    const isPatient = consultation.patient_id === user.id;
    const isAssignedDoctor = consultation.doctor_id === user.id;
    
    if (!isPatient && !isAssignedDoctor) {
      throw new Error("Not authorized to access this consultation");
    }

    // Verify consultation is completed with ICD-10 code
    if (consultation.status !== "completed") {
      throw new Error("Consultation must be completed to generate Honorarnote");
    }

    if (!consultation.icd10_code) {
      throw new Error("ICD-10 code is required to generate Honorarnote");
    }

    logStep("Consultation fetched", { 
      status: consultation.status, 
      icd10: consultation.icd10_code,
      doctor_id: consultation.doctor_id 
    });

    // Fetch doctor profile with billing info and signature
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
        phone
      `)
      .eq("id", consultation.doctor_id)
      .single();

    if (doctorError || !doctorProfile) {
      throw new Error(`Doctor profile not found: ${doctorError?.message}`);
    }

    logStep("Doctor profile fetched", { 
      name: doctorProfile.full_name,
      hasUID: !!doctorProfile.uid_number,
      hasSignature: !!doctorProfile.signature_url
    });

    // Generate or retrieve sequential honorarnote number
    let honorarnoteNumber = consultation.honorarnote_number;
    
    if (!honorarnoteNumber) {
      const currentYear = new Date().getFullYear();
      
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
          throw new Error(`Failed to generate honorarnote number: ${updateError.message}`);
        }
        honorarnoteNumber = `HN-${currentYear}-${String(updatedCounter).padStart(5, "0")}`;
      } else {
        // Increment the counter
        const newNumber = (counterData?.last_number || 0) + 1;
        await supabaseClient
          .from("honorarnote_counter")
          .update({ last_number: newNumber })
          .eq("year", currentYear);
        
        honorarnoteNumber = `HN-${currentYear}-${String(newNumber).padStart(5, "0")}`;
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

    // Create PDF - A4 size
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const black = rgb(0, 0, 0);
    const gray = rgb(0.4, 0.4, 0.4);
    const lightGray = rgb(0.6, 0.6, 0.6);

    const leftMargin = 50;
    const rightMargin = width - 50;
    const contentWidth = rightMargin - leftMargin;

    // ============= TOP SECTION =============
    let yTop = height - 50;

    // --- TOP LEFT: Patient Information ---
    page.drawText("Patient/in:", {
      x: leftMargin,
      y: yTop,
      size: 8,
      font: helvetica,
      color: lightGray,
    });
    yTop -= 14;

    page.drawText(consultation.patient?.full_name || "N/A", {
      x: leftMargin,
      y: yTop,
      size: 11,
      font: helveticaBold,
      color: black,
    });
    yTop -= 14;

    if (consultation.patient?.patient_address_street) {
      page.drawText(consultation.patient.patient_address_street, {
        x: leftMargin,
        y: yTop,
        size: 10,
        font: helvetica,
        color: black,
      });
      yTop -= 12;
    }

    if (consultation.patient?.patient_address_zip || consultation.patient?.patient_address_city) {
      const addressLine = [
        consultation.patient?.patient_address_zip,
        consultation.patient?.patient_address_city
      ].filter(Boolean).join(" ");
      page.drawText(addressLine, {
        x: leftMargin,
        y: yTop,
        size: 10,
        font: helvetica,
        color: black,
      });
    }

    // --- TOP RIGHT: Doctor Information ---
    let yTopRight = height - 50;
    const rightColumnX = width - 200;

    // Use billing name if available, otherwise full name
    const doctorDisplayName = doctorProfile.billing_name || doctorProfile.full_name || "Dr.";
    page.drawText(doctorDisplayName, {
      x: rightColumnX,
      y: yTopRight,
      size: 11,
      font: helveticaBold,
      color: black,
    });
    yTopRight -= 14;

    if (doctorProfile.practice_name) {
      page.drawText(doctorProfile.practice_name, {
        x: rightColumnX,
        y: yTopRight,
        size: 9,
        font: helvetica,
        color: gray,
      });
      yTopRight -= 12;
    }

    if (doctorProfile.practice_address_street) {
      page.drawText(doctorProfile.practice_address_street, {
        x: rightColumnX,
        y: yTopRight,
        size: 9,
        font: helvetica,
        color: black,
      });
      yTopRight -= 12;
    }

    if (doctorProfile.practice_address_zip || doctorProfile.practice_address_city) {
      const doctorAddressLine = [
        doctorProfile.practice_address_zip,
        doctorProfile.practice_address_city
      ].filter(Boolean).join(" ");
      page.drawText(doctorAddressLine, {
        x: rightColumnX,
        y: yTopRight,
        size: 9,
        font: helvetica,
        color: black,
      });
      yTopRight -= 12;
    }

    // Phone and Email (use billing contact if available)
    const doctorPhone = doctorProfile.billing_phone || doctorProfile.phone;
    if (doctorPhone) {
      page.drawText(`Tel: ${doctorPhone}`, {
        x: rightColumnX,
        y: yTopRight,
        size: 9,
        font: helvetica,
        color: black,
      });
      yTopRight -= 12;
    }

    if (doctorProfile.billing_email) {
      page.drawText(doctorProfile.billing_email, {
        x: rightColumnX,
        y: yTopRight,
        size: 9,
        font: helvetica,
        color: black,
      });
      yTopRight -= 12;
    }

    if (doctorProfile.uid_number) {
      page.drawText(`UID: ${doctorProfile.uid_number}`, {
        x: rightColumnX,
        y: yTopRight,
        size: 9,
        font: helvetica,
        color: gray,
      });
    }

    // ============= TITLE SECTION (CENTERED) =============
    let yTitle = height - 180;

    const titleText = "HONORARNOTE";
    const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 24);
    page.drawText(titleText, {
      x: (width - titleWidth) / 2,
      y: yTitle,
      size: 24,
      font: helveticaBold,
      color: black,
    });

    yTitle -= 20;

    // Date below title (centered)
    const currentDate = new Date();
    const dateText = currentDate.toLocaleDateString("de-AT", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    const dateWidth = helvetica.widthOfTextAtSize(dateText, 10);
    page.drawText(dateText, {
      x: (width - dateWidth) / 2,
      y: yTitle,
      size: 10,
      font: helvetica,
      color: gray,
    });

    // ============= BILL INFO SECTION (RIGHT ALIGNED) =============
    let yBillInfo = yTitle - 40;

    page.drawText("Rechnungsnummer:", {
      x: rightColumnX,
      y: yBillInfo,
      size: 9,
      font: helvetica,
      color: gray,
    });
    page.drawText(honorarnoteNumber, {
      x: rightColumnX + 95,
      y: yBillInfo,
      size: 9,
      font: helveticaBold,
      color: black,
    });
    yBillInfo -= 14;

    const billDate = consultation.responded_at 
      ? new Date(consultation.responded_at).toLocaleDateString("de-AT")
      : currentDate.toLocaleDateString("de-AT");
    page.drawText("Rechnungsdatum:", {
      x: rightColumnX,
      y: yBillInfo,
      size: 9,
      font: helvetica,
      color: gray,
    });
    page.drawText(billDate, {
      x: rightColumnX + 95,
      y: yBillInfo,
      size: 9,
      font: helvetica,
      color: black,
    });
    yBillInfo -= 14;

    page.drawText("Original", {
      x: rightColumnX + 95,
      y: yBillInfo,
      size: 9,
      font: helveticaBold,
      color: black,
    });

    // ============= DIAGNOSTIC & PATIENT INFO SECTION =============
    let yContent = yBillInfo - 50;

    // Horizontal line
    page.drawLine({
      start: { x: leftMargin, y: yContent },
      end: { x: rightMargin, y: yContent },
      thickness: 0.5,
      color: gray,
    });

    yContent -= 25;

    // Patient medical details
    page.drawText("Patientendaten", {
      x: leftMargin,
      y: yContent,
      size: 10,
      font: helveticaBold,
      color: black,
    });
    yContent -= 18;

    if (consultation.patient?.date_of_birth) {
      const dob = new Date(consultation.patient.date_of_birth);
      page.drawText(`Geburtsdatum: ${dob.toLocaleDateString("de-AT")}`, {
        x: leftMargin,
        y: yContent,
        size: 9,
        font: helvetica,
        color: black,
      });
      yContent -= 14;
    }

    if (consultation.patient?.social_security_number) {
      page.drawText(`SV-Nummer: ${consultation.patient.social_security_number}`, {
        x: leftMargin,
        y: yContent,
        size: 9,
        font: helvetica,
        color: black,
      });
      yContent -= 14;
    }

    if (consultation.patient?.insurance_provider) {
      page.drawText(`Versicherung: ${consultation.patient.insurance_provider}`, {
        x: leftMargin,
        y: yContent,
        size: 9,
        font: helvetica,
        color: black,
      });
      yContent -= 14;
    }

    yContent -= 20;

    // Service Details Header
    page.drawRectangle({
      x: leftMargin,
      y: yContent - 5,
      width: contentWidth,
      height: 22,
      color: rgb(0.95, 0.95, 0.95),
    });

    page.drawText("Datum", {
      x: leftMargin + 10,
      y: yContent + 2,
      size: 9,
      font: helveticaBold,
      color: black,
    });
    page.drawText("Leistung", {
      x: leftMargin + 100,
      y: yContent + 2,
      size: 9,
      font: helveticaBold,
      color: black,
    });
    page.drawText("Betrag", {
      x: rightMargin - 60,
      y: yContent + 2,
      size: 9,
      font: helveticaBold,
      color: black,
    });

    yContent -= 30;

    // Service Row
    const serviceDate = consultation.responded_at 
      ? new Date(consultation.responded_at).toLocaleDateString("de-AT")
      : currentDate.toLocaleDateString("de-AT");

    page.drawText(serviceDate, {
      x: leftMargin + 10,
      y: yContent,
      size: 9,
      font: helvetica,
      color: black,
    });

    page.drawText("Teledermatologische Konsultation", {
      x: leftMargin + 100,
      y: yContent,
      size: 9,
      font: helvetica,
      color: black,
    });

    const amount = consultation.consultation_price || (consultation.pricing_plan === "urgent" ? 74 : 49);
    page.drawText(`€${amount.toFixed(2)}`, {
      x: rightMargin - 60,
      y: yContent,
      size: 9,
      font: helveticaBold,
      color: black,
    });

    yContent -= 14;

    // ICD-10 Code
    page.drawText(`ICD-10: ${consultation.icd10_code}`, {
      x: leftMargin + 100,
      y: yContent,
      size: 8,
      font: helvetica,
      color: gray,
    });

    yContent -= 12;

    if (consultation.icd10_description) {
      page.drawText(consultation.icd10_description, {
        x: leftMargin + 100,
        y: yContent,
        size: 8,
        font: helvetica,
        color: gray,
      });
      yContent -= 12;
    }

    yContent -= 15;

    // Total line
    page.drawLine({
      start: { x: leftMargin, y: yContent },
      end: { x: rightMargin, y: yContent },
      thickness: 0.5,
      color: gray,
    });

    yContent -= 20;

    page.drawText("Gesamtbetrag:", {
      x: leftMargin + 10,
      y: yContent,
      size: 11,
      font: helveticaBold,
      color: black,
    });

    page.drawText(`€${amount.toFixed(2)}`, {
      x: rightMargin - 60,
      y: yContent,
      size: 11,
      font: helveticaBold,
      color: black,
    });

    yContent -= 16;

    page.drawText("Bereits bezahlt via Kreditkarte", {
      x: leftMargin + 10,
      y: yContent,
      size: 8,
      font: helvetica,
      color: gray,
    });

    // Bank Details (if needed for records)
    if (doctorProfile.iban) {
      yContent -= 30;
      page.drawText("Bankverbindung:", {
        x: leftMargin,
        y: yContent,
        size: 8,
        font: helvetica,
        color: gray,
      });
      yContent -= 12;
      page.drawText(`IBAN: ${doctorProfile.iban}`, {
        x: leftMargin,
        y: yContent,
        size: 8,
        font: helvetica,
        color: black,
      });
      if (doctorProfile.bic) {
        page.drawText(`BIC: ${doctorProfile.bic}`, {
          x: leftMargin + 200,
          y: yContent,
          size: 8,
          font: helvetica,
          color: black,
        });
      }
    }

    // ============= BOTTOM SECTION: Doctor Info & Signature =============
    const bottomY = 130;

    // Doctor info block (bottom right)
    let yBottom = bottomY;
    
    page.drawText(doctorDisplayName, {
      x: rightColumnX,
      y: yBottom,
      size: 10,
      font: helveticaBold,
      color: black,
    });
    yBottom -= 12;

    if (doctorProfile.practice_name) {
      page.drawText(doctorProfile.practice_name, {
        x: rightColumnX,
        y: yBottom,
        size: 9,
        font: helvetica,
        color: gray,
      });
      yBottom -= 12;
    }

    // Signature below doctor info
    if (signatureImageBytes) {
      try {
        // Try to embed the signature image
        let signatureImage;
        // Check if PNG or JPEG
        if (signatureImageBytes[0] === 0x89 && signatureImageBytes[1] === 0x50) {
          signatureImage = await pdfDoc.embedPng(signatureImageBytes);
        } else {
          signatureImage = await pdfDoc.embedJpg(signatureImageBytes);
        }
        
        // Scale signature to fit
        const sigDims = signatureImage.scale(0.5);
        const maxSigWidth = 120;
        const maxSigHeight = 50;
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

        yBottom -= 10;
        page.drawImage(signatureImage, {
          x: rightColumnX,
          y: yBottom - sigHeight,
          width: sigWidth,
          height: sigHeight,
        });
        
        logStep("Signature embedded in PDF");
      } catch (embedError) {
        logStep("Signature embed warning", { error: String(embedError) });
        // Draw a placeholder line for signature
        yBottom -= 10;
        page.drawLine({
          start: { x: rightColumnX, y: yBottom },
          end: { x: rightColumnX + 100, y: yBottom },
          thickness: 0.5,
          color: black,
        });
      }
    } else {
      // Draw signature line if no signature uploaded
      yBottom -= 20;
      page.drawLine({
        start: { x: rightColumnX, y: yBottom },
        end: { x: rightColumnX + 100, y: yBottom },
        thickness: 0.5,
        color: black,
      });
    }

    // Footer
    page.drawText("Diese Honorarnote dient zur Einreichung bei Ihrer privaten Krankenversicherung.", {
      x: leftMargin,
      y: 40,
      size: 7,
      font: helvetica,
      color: lightGray,
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    logStep("PDF generated", { size: pdfBytes.length });

    // Upload to storage
    const storagePath = `${user.id}/${consultation_id}/honorarnote_${honorarnoteNumber}.pdf`;
    
    const { error: uploadError } = await supabaseClient.storage
      .from("honorarnoten")
      .upload(storagePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      logStep("Upload error", { error: uploadError.message });
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
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
      throw new Error(`Failed to generate signed URL: ${signedUrlError.message}`);
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
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
