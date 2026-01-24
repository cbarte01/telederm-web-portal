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

    // Fetch consultation with patient and doctor profiles
    const { data: consultation, error: consultationError } = await supabaseClient
      .from("consultations")
      .select(`
        *,
        patient:profiles!consultations_patient_id_fkey(
          full_name,
          date_of_birth,
          social_security_number
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

    // Fetch doctor profile
    const { data: doctorProfile, error: doctorError } = await supabaseClient
      .from("profiles")
      .select("full_name, practice_name, practice_address_street, practice_address_zip, practice_address_city, uid_number, iban, bic")
      .eq("id", consultation.doctor_id)
      .single();

    if (doctorError || !doctorProfile) {
      throw new Error(`Doctor profile not found: ${doctorError?.message}`);
    }

    logStep("Doctor profile fetched", { 
      name: doctorProfile.full_name,
      hasUID: !!doctorProfile.uid_number 
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

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { height } = page.getSize();

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const black = rgb(0, 0, 0);
    const gray = rgb(0.4, 0.4, 0.4);
    const primaryColor = rgb(0.2, 0.4, 0.6);

    let y = height - 50;
    const leftMargin = 50;
    const rightMargin = 545;

    // Doctor Header
    page.drawText(doctorProfile.full_name || "Dr.", {
      x: leftMargin,
      y,
      size: 14,
      font: helveticaBold,
      color: black,
    });
    y -= 18;

    if (doctorProfile.practice_name) {
      page.drawText(doctorProfile.practice_name, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: gray,
      });
      y -= 14;
    }

    if (doctorProfile.practice_address_street) {
      page.drawText(doctorProfile.practice_address_street, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: gray,
      });
      y -= 14;
    }

    if (doctorProfile.practice_address_zip && doctorProfile.practice_address_city) {
      page.drawText(`${doctorProfile.practice_address_zip} ${doctorProfile.practice_address_city}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: gray,
      });
      y -= 14;
    }

    if (doctorProfile.uid_number) {
      page.drawText(`UID: ${doctorProfile.uid_number}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: gray,
      });
      y -= 14;
    }

    y -= 30;

    // Title
    page.drawText("HONORARNOTE", {
      x: leftMargin,
      y,
      size: 22,
      font: helveticaBold,
      color: primaryColor,
    });

    // Honorarnote number on the right
    page.drawText(honorarnoteNumber, {
      x: rightMargin - 120,
      y,
      size: 12,
      font: helveticaBold,
      color: black,
    });

    y -= 40;

    // Horizontal line
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: rightMargin, y },
      thickness: 1,
      color: gray,
    });

    y -= 30;

    // Patient Information
    page.drawText("Patient/in:", {
      x: leftMargin,
      y,
      size: 10,
      font: helveticaBold,
      color: gray,
    });
    page.drawText(consultation.patient?.full_name || "N/A", {
      x: leftMargin + 100,
      y,
      size: 11,
      font: helvetica,
      color: black,
    });
    y -= 18;

    if (consultation.patient?.date_of_birth) {
      page.drawText("Geb.-Datum:", {
        x: leftMargin,
        y,
        size: 10,
        font: helveticaBold,
        color: gray,
      });
      const dob = new Date(consultation.patient.date_of_birth);
      page.drawText(dob.toLocaleDateString("de-AT"), {
        x: leftMargin + 100,
        y,
        size: 11,
        font: helvetica,
        color: black,
      });
      y -= 18;
    }

    if (consultation.patient?.social_security_number) {
      page.drawText("SV-Nr:", {
        x: leftMargin,
        y,
        size: 10,
        font: helveticaBold,
        color: gray,
      });
      page.drawText(consultation.patient.social_security_number, {
        x: leftMargin + 100,
        y,
        size: 11,
        font: helvetica,
        color: black,
      });
      y -= 18;
    }

    y -= 30;

    // Service Details Header
    page.drawRectangle({
      x: leftMargin,
      y: y - 5,
      width: rightMargin - leftMargin,
      height: 25,
      color: rgb(0.95, 0.95, 0.95),
    });

    page.drawText("Datum", {
      x: leftMargin + 10,
      y: y + 2,
      size: 10,
      font: helveticaBold,
      color: black,
    });
    page.drawText("Leistung", {
      x: leftMargin + 100,
      y: y + 2,
      size: 10,
      font: helveticaBold,
      color: black,
    });
    page.drawText("Betrag", {
      x: rightMargin - 70,
      y: y + 2,
      size: 10,
      font: helveticaBold,
      color: black,
    });

    y -= 35;

    // Service Row
    const serviceDate = consultation.responded_at 
      ? new Date(consultation.responded_at).toLocaleDateString("de-AT")
      : new Date().toLocaleDateString("de-AT");

    page.drawText(serviceDate, {
      x: leftMargin + 10,
      y,
      size: 10,
      font: helvetica,
      color: black,
    });

    page.drawText("Teledermatologische Konsultation", {
      x: leftMargin + 100,
      y,
      size: 10,
      font: helvetica,
      color: black,
    });

    const amount = consultation.consultation_price || (consultation.pricing_plan === "urgent" ? 74 : 49);
    page.drawText(`€${amount.toFixed(2)}`, {
      x: rightMargin - 70,
      y,
      size: 10,
      font: helveticaBold,
      color: black,
    });

    y -= 18;

    // ICD-10 Code
    page.drawText(`ICD-10: ${consultation.icd10_code}`, {
      x: leftMargin + 100,
      y,
      size: 9,
      font: helvetica,
      color: gray,
    });

    y -= 14;

    if (consultation.icd10_description) {
      page.drawText(consultation.icd10_description, {
        x: leftMargin + 100,
        y,
        size: 9,
        font: helvetica,
        color: gray,
      });
      y -= 14;
    }

    y -= 30;

    // Total line
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: rightMargin, y },
      thickness: 1,
      color: gray,
    });

    y -= 25;

    page.drawText("Gesamtbetrag:", {
      x: leftMargin + 10,
      y,
      size: 12,
      font: helveticaBold,
      color: black,
    });

    page.drawText(`€${amount.toFixed(2)}`, {
      x: rightMargin - 70,
      y,
      size: 12,
      font: helveticaBold,
      color: primaryColor,
    });

    y -= 20;

    page.drawText("Bereits bezahlt via Kreditkarte", {
      x: leftMargin + 10,
      y,
      size: 9,
      font: helvetica,
      color: gray,
    });

    y -= 50;

    // Bank Details Section
    if (doctorProfile.iban) {
      page.drawLine({
        start: { x: leftMargin, y },
        end: { x: rightMargin, y },
        thickness: 0.5,
        color: gray,
      });

      y -= 25;

      page.drawText("Bankverbindung (für Rückfragen):", {
        x: leftMargin,
        y,
        size: 10,
        font: helveticaBold,
        color: gray,
      });

      y -= 18;

      page.drawText(`IBAN: ${doctorProfile.iban}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: black,
      });

      if (doctorProfile.bic) {
        y -= 14;
        page.drawText(`BIC: ${doctorProfile.bic}`, {
          x: leftMargin,
          y,
          size: 10,
          font: helvetica,
          color: black,
        });
      }
    }

    // Footer
    page.drawText("Diese Honorarnote kann zur Einreichung bei Ihrer privaten Krankenversicherung verwendet werden.", {
      x: leftMargin,
      y: 50,
      size: 8,
      font: helvetica,
      color: gray,
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
