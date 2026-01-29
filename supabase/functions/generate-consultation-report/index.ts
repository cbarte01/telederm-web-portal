import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-CONSULTATION-REPORT] ${step}${detailsStr}`);
};

// Translations
const translations = {
  en: {
    title: "Consultation Report",
    subtitle: "Dermatological Telemedicine Consultation",
    patientInformation: "Patient Information",
    name: "Name",
    dateOfBirth: "Date of Birth",
    biologicalSex: "Biological Sex",
    male: "Male",
    female: "Female",
    diverse: "Diverse",
    consultationDetails: "Consultation Details",
    submittedOn: "Submitted on",
    respondedOn: "Responded on",
    concernCategory: "Category",
    affectedAreas: "Affected Areas",
    symptoms: "Symptoms",
    severity: "Severity",
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
    onset: "Onset",
    today: "Today",
    thisWeek: "This week",
    thisMonth: "This month",
    longerAgo: "Longer ago",
    changes: "Changes",
    medicalHistory: "Medical History",
    allergies: "Allergies",
    medications: "Medications",
    selfTreatment: "Self-treatment",
    yes: "Yes",
    no: "No",
    none: "None",
    additionalNotes: "Additional Notes",
    doctorAssessment: "Doctor's Assessment",
    diagnosis: "Diagnosis",
    doctorName: "Doctor",
    icd10Code: "ICD-10 Code",
    disclaimerTitle: "Important Notice",
    disclaimer: "This document is a summary of a telemedicine consultation and does not replace an in-person medical examination. Please consult a doctor in person for acute or worsening symptoms.",
    generatedOn: "Generated on",
    concernLabels: {
      skin: "Skin Conditions",
      hair: "Hair & Scalp",
      nails: "Nail Problems",
      infections: "Infections",
      allergies: "Allergies & Reactions",
      pigmentation: "Pigmentation",
    },
    symptomLabels: {
      itching: "Itching",
      pain: "Pain",
      burning: "Burning",
      swelling: "Swelling",
      oozing: "Oozing",
      bleeding: "Bleeding",
      flaking: "Flaking",
      none: "None",
    },
  },
  de: {
    title: "Befundbericht",
    subtitle: "Teledermatologische Konsultation",
    patientInformation: "Patienteninformationen",
    name: "Name",
    dateOfBirth: "Geburtsdatum",
    biologicalSex: "Geschlecht",
    male: "Männlich",
    female: "Weiblich",
    diverse: "Divers",
    consultationDetails: "Konsultationsdetails",
    submittedOn: "Eingereicht am",
    respondedOn: "Beantwortet am",
    concernCategory: "Kategorie",
    affectedAreas: "Betroffene Bereiche",
    symptoms: "Symptome",
    severity: "Schweregrad",
    mild: "Leicht",
    moderate: "Mäßig",
    severe: "Schwer",
    onset: "Beginn",
    today: "Heute",
    thisWeek: "Diese Woche",
    thisMonth: "Diesen Monat",
    longerAgo: "Länger her",
    changes: "Veränderungen",
    medicalHistory: "Medizinische Vorgeschichte",
    allergies: "Allergien",
    medications: "Medikamente",
    selfTreatment: "Selbstbehandlung",
    yes: "Ja",
    no: "Nein",
    none: "Keine",
    additionalNotes: "Zusätzliche Hinweise",
    doctorAssessment: "Ärztliche Beurteilung",
    diagnosis: "Diagnose",
    doctorName: "Arzt/Ärztin",
    icd10Code: "ICD-10-Code",
    disclaimerTitle: "Wichtiger Hinweis",
    disclaimer: "Dieses Dokument ist eine Zusammenfassung einer telemedizinischen Konsultation und ersetzt keine persönliche ärztliche Untersuchung. Bei akuten oder sich verschlechternden Symptomen suchen Sie bitte einen Arzt persönlich auf.",
    generatedOn: "Erstellt am",
    concernLabels: {
      skin: "Hauterkrankungen",
      hair: "Haare & Kopfhaut",
      nails: "Nagelprobleme",
      infections: "Infektionen",
      allergies: "Allergien & Reaktionen",
      pigmentation: "Pigmentierung",
    },
    symptomLabels: {
      itching: "Juckreiz",
      pain: "Schmerzen",
      burning: "Brennen",
      swelling: "Schwellung",
      oozing: "Nässen",
      bleeding: "Bluten",
      flaking: "Schuppen",
      none: "Keine",
    },
  },
};

const bodyAreaLabels: Record<string, { en: string; de: string }> = {
  head: { en: 'Head', de: 'Kopf' },
  face: { en: 'Face', de: 'Gesicht' },
  neck: { en: 'Neck', de: 'Hals' },
  chest: { en: 'Chest', de: 'Brust' },
  abdomen: { en: 'Abdomen', de: 'Bauch' },
  upper_back: { en: 'Upper Back', de: 'Oberer Rücken' },
  lower_back: { en: 'Lower Back', de: 'Unterer Rücken' },
  left_shoulder: { en: 'Left Shoulder', de: 'Linke Schulter' },
  right_shoulder: { en: 'Right Shoulder', de: 'Rechte Schulter' },
  left_upper_arm: { en: 'Left Upper Arm', de: 'Linker Oberarm' },
  right_upper_arm: { en: 'Right Upper Arm', de: 'Rechter Oberarm' },
  left_forearm: { en: 'Left Forearm', de: 'Linker Unterarm' },
  right_forearm: { en: 'Right Forearm', de: 'Rechter Unterarm' },
  left_hand: { en: 'Left Hand', de: 'Linke Hand' },
  right_hand: { en: 'Right Hand', de: 'Rechte Hand' },
  groin: { en: 'Groin', de: 'Leiste' },
  left_thigh: { en: 'Left Thigh', de: 'Linker Oberschenkel' },
  right_thigh: { en: 'Right Thigh', de: 'Rechter Oberschenkel' },
  left_knee: { en: 'Left Knee', de: 'Linkes Knie' },
  right_knee: { en: 'Right Knee', de: 'Rechtes Knie' },
  left_lower_leg: { en: 'Left Lower Leg', de: 'Linker Unterschenkel' },
  right_lower_leg: { en: 'Right Lower Leg', de: 'Rechter Unterschenkel' },
  left_foot: { en: 'Left Foot', de: 'Linker Fuß' },
  right_foot: { en: 'Right Foot', de: 'Rechter Fuß' },
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
    const { consultation_id, language = "de" } = await req.json();
    if (!consultation_id) {
      throw new Error("consultation_id is required");
    }

    // Validate consultation_id is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(consultation_id)) {
      throw new Error("Invalid consultation_id format");
    }

    // Validate and sanitize language - only allow 'en' or 'de'
    const allowedLanguages = ["en", "de"];
    const lang = allowedLanguages.includes(language) ? language : "de";
    const t = translations[lang as keyof typeof translations];
    logStep("Generating report", { consultation_id, language: lang });

    // Fetch consultation with patient profile
    const { data: consultation, error: consultationError } = await supabaseClient
      .from("consultations")
      .select(`
        *,
        patient:profiles!consultations_patient_id_fkey(
          full_name,
          date_of_birth,
          biological_sex
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

    // Verify consultation is completed
    if (consultation.status !== "completed") {
      throw new Error("Consultation must be completed to generate report");
    }

    logStep("Consultation fetched", { 
      status: consultation.status, 
      icd10: consultation.icd10_code,
      doctor_id: consultation.doctor_id 
    });

    // Fetch doctor profile
    const { data: doctorProfile, error: doctorError } = await supabaseClient
      .from("profiles")
      .select("full_name, practice_name")
      .eq("id", consultation.doctor_id)
      .single();

    if (doctorError) {
      logStep("Doctor profile fetch warning", { error: doctorError.message });
    }

    // Create PDF - A4 size
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const black = rgb(0, 0, 0);
    const gray = rgb(0.4, 0.4, 0.4);
    const primary = rgb(0.1, 0.4, 0.5);

    const leftMargin = 50;
    const rightMargin = width - 50;
    const lineHeight = 16;
    const sectionGap = 24;
    
    const formatDate = (dateStr: string | null, includeTime = false) => {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      if (includeTime) {
        options.hour = "2-digit";
        options.minute = "2-digit";
      }
      return date.toLocaleDateString(lang === "de" ? "de-AT" : "en-US", options);
    };

    // Helper to wrap text
    const wrapText = (text: string, maxWidth: number, font: typeof helvetica, fontSize: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    let y = height - 60;

    // Check if we need a new page
    const checkPage = (neededHeight: number) => {
      if (y - neededHeight < 80) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - 60;
      }
    };

    // ============= HEADER =============
    page.drawText(t.title, {
      x: leftMargin,
      y,
      size: 20,
      font: helveticaBold,
      color: primary,
    });
    y -= 24;

    page.drawText(t.subtitle, {
      x: leftMargin,
      y,
      size: 11,
      font: helvetica,
      color: gray,
    });
    y -= sectionGap;

    // Horizontal line
    page.drawLine({
      start: { x: leftMargin, y },
      end: { x: rightMargin, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });
    y -= sectionGap;

    // ============= PATIENT INFORMATION =============
    page.drawText(t.patientInformation, {
      x: leftMargin,
      y,
      size: 12,
      font: helveticaBold,
      color: black,
    });
    y -= lineHeight + 4;

    // Name
    const patientName = consultation.patient?.full_name || "-";
    page.drawText(`${t.name}: ${patientName}`, {
      x: leftMargin,
      y,
      size: 10,
      font: helvetica,
      color: black,
    });
    y -= lineHeight;

    // DOB
    if (consultation.patient?.date_of_birth) {
      page.drawText(`${t.dateOfBirth}: ${formatDate(consultation.patient.date_of_birth)}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: black,
      });
      y -= lineHeight;
    }

    // Sex
    if (consultation.biological_sex || consultation.patient?.biological_sex) {
      const sex = consultation.biological_sex || consultation.patient?.biological_sex;
      const sexLabel = sex === "male" ? t.male : sex === "female" ? t.female : t.diverse;
      page.drawText(`${t.biologicalSex}: ${sexLabel}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: black,
      });
      y -= lineHeight;
    }

    y -= sectionGap;

    // ============= CONSULTATION DETAILS =============
    checkPage(150);
    page.drawText(t.consultationDetails, {
      x: leftMargin,
      y,
      size: 12,
      font: helveticaBold,
      color: black,
    });
    y -= lineHeight + 4;

    // Submitted date
    page.drawText(`${t.submittedOn}: ${formatDate(consultation.submitted_at, true)}`, {
      x: leftMargin,
      y,
      size: 10,
      font: helvetica,
      color: black,
    });
    y -= lineHeight;

    // Responded date
    if (consultation.responded_at) {
      page.drawText(`${t.respondedOn}: ${formatDate(consultation.responded_at, true)}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: black,
      });
      y -= lineHeight;
    }

    // Concern category
    if (consultation.concern_category) {
      const concernLabel = t.concernLabels[consultation.concern_category as keyof typeof t.concernLabels] || consultation.concern_category;
      page.drawText(`${t.concernCategory}: ${concernLabel}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: black,
      });
      y -= lineHeight;
    }

    // Body locations
    if (consultation.body_locations && consultation.body_locations.length > 0) {
      const langKey = lang as "en" | "de";
      const locations = consultation.body_locations
        .map((loc: string) => bodyAreaLabels[loc]?.[langKey] || loc)
        .join(", ");
      const locLines = wrapText(`${t.affectedAreas}: ${locations}`, rightMargin - leftMargin, helvetica, 10);
      for (const line of locLines) {
        page.drawText(line, { x: leftMargin, y, size: 10, font: helvetica, color: black });
        y -= lineHeight;
      }
    }

    // Symptoms
    if (consultation.symptoms && Array.isArray(consultation.symptoms) && consultation.symptoms.length > 0) {
      const symptoms = consultation.symptoms
        .map((sym: string) => t.symptomLabels[sym as keyof typeof t.symptomLabels] || sym)
        .join(", ");
      page.drawText(`${t.symptoms}: ${symptoms}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: black,
      });
      y -= lineHeight;
    }

    // Severity
    if (consultation.symptom_severity) {
      const severityMap: Record<string, string> = { mild: t.mild, moderate: t.moderate, severe: t.severe };
      const severityLabel = severityMap[consultation.symptom_severity] || consultation.symptom_severity;
      page.drawText(`${t.severity}: ${severityLabel}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: black,
      });
      y -= lineHeight;
    }

    // Onset
    if (consultation.symptom_onset) {
      const onsetMap: Record<string, string> = { today: t.today, thisWeek: t.thisWeek, thisMonth: t.thisMonth, longerAgo: t.longerAgo };
      const onsetLabel = onsetMap[consultation.symptom_onset] || consultation.symptom_onset;
      page.drawText(`${t.onset}: ${onsetLabel}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: black,
      });
      y -= lineHeight;
    }

    // Changes
    if (consultation.has_changed && consultation.change_description) {
      y -= 4;
      page.drawText(`${t.changes}:`, { x: leftMargin, y, size: 10, font: helveticaBold, color: black });
      y -= lineHeight;
      const changeLines = wrapText(consultation.change_description, rightMargin - leftMargin, helvetica, 10);
      for (const line of changeLines) {
        checkPage(lineHeight);
        page.drawText(line, { x: leftMargin, y, size: 10, font: helvetica, color: black });
        y -= lineHeight;
      }
    }

    y -= sectionGap;

    // ============= MEDICAL HISTORY =============
    checkPage(100);
    page.drawText(t.medicalHistory, {
      x: leftMargin,
      y,
      size: 12,
      font: helveticaBold,
      color: black,
    });
    y -= lineHeight + 4;

    // Allergies
    const allergiesText = consultation.has_allergies 
      ? (consultation.allergies_description || t.yes)
      : t.none;
    page.drawText(`${t.allergies}: ${allergiesText}`, {
      x: leftMargin,
      y,
      size: 10,
      font: helvetica,
      color: black,
    });
    y -= lineHeight;

    // Medications
    const medicationsText = consultation.takes_medications 
      ? (consultation.medications_description || t.yes)
      : t.none;
    page.drawText(`${t.medications}: ${medicationsText}`, {
      x: leftMargin,
      y,
      size: 10,
      font: helvetica,
      color: black,
    });
    y -= lineHeight;

    // Self-treatment
    if (consultation.has_self_treated) {
      const selfTreatText = consultation.self_treatment_description || t.yes;
      const stLines = wrapText(`${t.selfTreatment}: ${selfTreatText}`, rightMargin - leftMargin, helvetica, 10);
      for (const line of stLines) {
        checkPage(lineHeight);
        page.drawText(line, { x: leftMargin, y, size: 10, font: helvetica, color: black });
        y -= lineHeight;
      }
    }

    // Additional notes
    if (consultation.additional_notes) {
      y -= 4;
      page.drawText(`${t.additionalNotes}:`, { x: leftMargin, y, size: 10, font: helveticaBold, color: black });
      y -= lineHeight;
      const noteLines = wrapText(consultation.additional_notes, rightMargin - leftMargin, helvetica, 10);
      for (const line of noteLines) {
        checkPage(lineHeight);
        page.drawText(line, { x: leftMargin, y, size: 10, font: helvetica, color: black });
        y -= lineHeight;
      }
    }

    y -= sectionGap;

    // ============= DOCTOR'S ASSESSMENT =============
    checkPage(120);
    
    // Draw a box for the assessment
    const assessmentBoxTop = y + 8;
    
    page.drawText(t.doctorAssessment, {
      x: leftMargin,
      y,
      size: 12,
      font: helveticaBold,
      color: primary,
    });
    y -= lineHeight + 4;

    // ICD-10
    if (consultation.icd10_code) {
      page.drawText(`${t.icd10Code}: ${consultation.icd10_code}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helveticaBold,
        color: black,
      });
      y -= lineHeight;
      
      if (consultation.icd10_description) {
        page.drawText(`${t.diagnosis}: ${consultation.icd10_description}`, {
          x: leftMargin,
          y,
          size: 10,
          font: helvetica,
          color: black,
        });
        y -= lineHeight;
      }
    }

    // Doctor response
    if (consultation.doctor_response) {
      y -= 4;
      const responseLines = wrapText(consultation.doctor_response, rightMargin - leftMargin - 10, helvetica, 10);
      for (const line of responseLines) {
        checkPage(lineHeight);
        page.drawText(line, { x: leftMargin, y, size: 10, font: helvetica, color: black });
        y -= lineHeight;
      }
    }

    // Doctor name
    if (doctorProfile?.full_name) {
      y -= 8;
      page.drawText(`${t.doctorName}: ${doctorProfile.full_name}`, {
        x: leftMargin,
        y,
        size: 10,
        font: helvetica,
        color: gray,
      });
      y -= lineHeight;
    }

    y -= sectionGap;

    // ============= DISCLAIMER =============
    checkPage(80);
    
    page.drawRectangle({
      x: leftMargin,
      y: y - 60,
      width: rightMargin - leftMargin,
      height: 65,
      color: rgb(0.97, 0.97, 0.97),
      borderColor: rgb(0.9, 0.9, 0.9),
      borderWidth: 0.5,
    });

    y -= 8;
    page.drawText(t.disclaimerTitle, {
      x: leftMargin + 10,
      y,
      size: 9,
      font: helveticaBold,
      color: gray,
    });
    y -= 14;

    const disclaimerLines = wrapText(t.disclaimer, rightMargin - leftMargin - 20, helvetica, 8);
    for (const line of disclaimerLines) {
      page.drawText(line, { x: leftMargin + 10, y, size: 8, font: helvetica, color: gray });
      y -= 12;
    }

    // ============= FOOTER =============
    const footerY = 40;
    const generatedText = `${t.generatedOn}: ${formatDate(new Date().toISOString(), true)}`;
    page.drawText(generatedText, {
      x: leftMargin,
      y: footerY,
      size: 8,
      font: helvetica,
      color: gray,
    });

    page.drawText("medena.at", {
      x: rightMargin - 50,
      y: footerY,
      size: 8,
      font: helvetica,
      color: gray,
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    logStep("PDF generated", { size: pdfBytes.length });

    // Generate filename
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${consultation.patient_id}/${consultation_id}/report_${dateStr}_${lang}.pdf`;

    // Upload to storage
    const { error: uploadError } = await supabaseClient.storage
      .from("honorarnoten")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Update consultation with report path
    await supabaseClient
      .from("consultations")
      .update({ report_storage_path: fileName })
      .eq("id", consultation_id);

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabaseClient.storage
      .from("honorarnoten")
      .createSignedUrl(fileName, 3600);

    if (urlError) {
      throw new Error(`URL generation failed: ${urlError.message}`);
    }

    logStep("Report uploaded and URL generated", { fileName });

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: urlData.signedUrl,
        file_name: fileName,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    logStep("Error", { error: String(error) });
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
