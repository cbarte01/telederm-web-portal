import { useState } from 'react';

type Lang = 'de' | 'en';

const labels = {
  de: {
    title: 'BEFUNDBERICHT',
    subtitle: 'Teledermatologische Konsultation',
    patientInfo: 'PATIENTENINFORMATIONEN',
    name: 'Name',
    dob: 'Geburtsdatum',
    ssn: 'SVNr',
    sex: 'Geschlecht',
    address: 'Adresse',
    insurance: 'Versicherung',
    consultationDetails: 'KONSULTATIONSDETAILS',
    submitted: 'Eingereicht',
    responded: 'Beantwortet',
    category: 'Kategorie',
    bodyAreas: 'Betroffene Bereiche',
    symptoms: 'Symptome',
    severity: 'Schweregrad',
    onset: 'Beginn',
    changes: 'Veränderungen',
    changeDesc: 'Beschreibung',
    medicalHistory: 'MEDIZINISCHE VORGESCHICHTE',
    allergies: 'Allergien',
    medications: 'Medikamente',
    selfTreatment: 'Selbstbehandlung',
    additionalNotes: 'Zusätzliche Anmerkungen',
    assessment: 'ÄRZTLICHE BEURTEILUNG',
    icd10: 'ICD-10',
    diagnosis: 'Diagnose',
    doctor: 'Arzt',
    disclaimer: 'Wichtiger Hinweis',
    disclaimerText: 'Dieser teledermatologische Befundbericht ersetzt keine persönliche ärztliche Untersuchung. Bei akuten Beschwerden, Verschlechterung der Symptome oder Unsicherheit bezüglich der Diagnose wenden Sie sich bitte umgehend an Ihren Hautarzt oder eine dermatologische Ambulanz. Die Beurteilung basiert ausschließlich auf den übermittelten Fotos und Angaben.',
    createdAt: 'Erstellt am',
    yes: 'Ja',
    no: 'Nein',
    none: 'Keine',
    sexMale: 'Männlich',
  },
  en: {
    title: 'MEDICAL REPORT',
    subtitle: 'Teledermatological Consultation',
    patientInfo: 'PATIENT INFORMATION',
    name: 'Name',
    dob: 'Date of Birth',
    ssn: 'SSN',
    sex: 'Sex',
    address: 'Address',
    insurance: 'Insurance',
    consultationDetails: 'CONSULTATION DETAILS',
    submitted: 'Submitted',
    responded: 'Responded',
    category: 'Category',
    bodyAreas: 'Affected Areas',
    symptoms: 'Symptoms',
    severity: 'Severity',
    onset: 'Onset',
    changes: 'Changes',
    changeDesc: 'Description',
    medicalHistory: 'MEDICAL HISTORY',
    allergies: 'Allergies',
    medications: 'Medications',
    selfTreatment: 'Self-Treatment',
    additionalNotes: 'Additional Notes',
    assessment: 'MEDICAL ASSESSMENT',
    icd10: 'ICD-10',
    diagnosis: 'Diagnosis',
    doctor: 'Doctor',
    disclaimer: 'Important Notice',
    disclaimerText: 'This teledermatological report does not replace a personal medical examination. In case of acute symptoms, worsening conditions, or uncertainty regarding the diagnosis, please consult your dermatologist or a dermatological clinic immediately. The assessment is based solely on the submitted photos and information.',
    createdAt: 'Created on',
    yes: 'Yes',
    no: 'No',
    none: 'None',
    sexMale: 'Male',
  },
};

const mockData = {
  patient: {
    name: 'Max Mustermann',
    dob: '15.03.1985',
    ssn: '1234 150385',
    sex: 'male' as const,
    address: 'Musterstraße 1, 1010 Wien',
    insurance: 'ÖGK',
  },
  consultation: {
    submittedAt: '01.03.2026',
    respondedAt: '02.03.2026',
    category: { de: 'Hautveränderung / Muttermal', en: 'Skin Lesion / Mole' },
    bodyLocations: { de: ['Gesicht', 'Hals'], en: ['Face', 'Neck'] },
    symptoms: { de: ['Juckreiz', 'Rötung', 'Schuppung'], en: ['Itching', 'Redness', 'Scaling'] },
    severity: { de: 'Mäßig', en: 'Moderate' },
    onset: { de: 'Diese Woche', en: 'This week' },
    hasChanged: true,
    changeDescription: {
      de: 'Die Rötung hat sich in den letzten Tagen ausgebreitet und der Juckreiz hat zugenommen.',
      en: 'The redness has spread over the past few days and the itching has increased.',
    },
  },
  history: {
    hasAllergies: false,
    allergiesDescription: null as string | null,
    takesMedications: false,
    medicationsDescription: null as string | null,
    hasSelfTreated: true,
    selfTreatmentDescription: {
      de: 'Feuchtigkeitscreme aufgetragen, keine Besserung.',
      en: 'Applied moisturizer, no improvement.',
    },
    additionalNotes: {
      de: 'Familiäre Vorbelastung mit Neurodermitis (Mutter).',
      en: 'Family history of atopic dermatitis (mother).',
    },
  },
  assessment: {
    icd10Code: 'L20.9',
    icd10Description: {
      de: 'Atopisches Ekzem, nicht näher bezeichnet',
      en: 'Atopic dermatitis, unspecified',
    },
    doctorResponse: {
      de: `Sehr geehrter Patient,

basierend auf den übermittelten Fotos und Ihren Angaben zeigt sich ein typisches Bild einer atopischen Dermatitis (Neurodermitis) im Bereich des Gesichts und Halses. Die beschriebenen Symptome – Juckreiz, Rötung und Schuppung – sind charakteristisch für diese Erkrankung.

Therapieempfehlung:
• Topische Kortikosteroide (z.B. Hydrocortison 1% Creme) für 5–7 Tage, 2x täglich dünn auf die betroffenen Stellen auftragen
• Anschließend Umstellung auf eine nicht-steroidale Pflegecreme (z.B. mit Urea 5%)
• Rückfettende Basispflege 2x täglich
• Vermeidung bekannter Triggerfaktoren (Wolle, aggressive Reinigungsmittel)

Bei ausbleibender Besserung innerhalb von 7–10 Tagen empfehle ich eine persönliche Vorstellung beim Dermatologen.`,
      en: `Dear Patient,

Based on the submitted photos and your information, the presentation is consistent with atopic dermatitis (eczema) affecting the face and neck area. The described symptoms – itching, redness, and scaling – are characteristic of this condition.

Treatment recommendations:
• Topical corticosteroids (e.g., Hydrocortisone 1% cream) for 5–7 days, apply thinly twice daily to affected areas
• Subsequently switch to a non-steroidal care cream (e.g., with Urea 5%)
• Emollient base care twice daily
• Avoidance of known trigger factors (wool, harsh cleansers)

If no improvement within 7–10 days, I recommend an in-person consultation with a dermatologist.`,
    },
    doctorName: 'Dr. Anna Weber',
  },
  createdAt: '05.03.2026',
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3 pb-1"
    style={{ color: '#1a1a1a', borderBottom: '1.5px solid #d0d0d0' }}
  >
    {children}
  </h2>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex text-[10px] leading-[1.6] gap-1">
    <span className="font-semibold shrink-0" style={{ color: '#444', minWidth: '140px' }}>
      {label}:
    </span>
    <span style={{ color: '#1a1a1a' }}>{value}</span>
  </div>
);

const BefundberichtPreview = () => {
  const [lang, setLang] = useState<Lang>('de');
  const t = labels[lang];
  const d = mockData;

  return (
    <div className="min-h-screen bg-neutral-100 py-10 px-4 print:bg-white print:p-0">
      {/* Language toggle - outside the document */}
      <div className="fixed top-4 right-4 z-50 flex gap-1 print:hidden">
        {(['de', 'en'] as const).map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase rounded transition-colors ${
              lang === code
                ? 'bg-neutral-800 text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-300'
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      {/* A4 Document */}
      <div
        className="mx-auto bg-white shadow-xl print:shadow-none"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm 22mm 18mm 22mm',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          color: '#1a1a1a',
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold tracking-[0.08em]" style={{ color: '#111' }}>
            {t.title}
          </h1>
          <p className="text-[11px] mt-0.5 tracking-wide" style={{ color: '#666' }}>
            {t.subtitle}
          </p>
          <div className="mt-2" style={{ borderBottom: '2.5px solid #111', width: '100%' }} />
        </div>

        {/* Patient Information */}
        <div className="mb-5">
          <SectionTitle>{t.patientInfo}</SectionTitle>
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <Field label={t.name} value={d.patient.name} />
              <Field label={t.dob} value={d.patient.dob} />
              <Field label={t.ssn} value={d.patient.ssn} />
            </div>
            <div>
              <Field label={t.sex} value={t.sexMale} />
              <Field label={t.address} value={d.patient.address} />
              <Field label={t.insurance} value={d.patient.insurance} />
            </div>
          </div>
        </div>

        {/* Consultation Details */}
        <div className="mb-5">
          <SectionTitle>{t.consultationDetails}</SectionTitle>
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <Field label={t.submitted} value={d.consultation.submittedAt} />
              <Field label={t.responded} value={d.consultation.respondedAt} />
              <Field label={t.category} value={d.consultation.category[lang]} />
              <Field label={t.bodyAreas} value={d.consultation.bodyLocations[lang].join(', ')} />
            </div>
            <div>
              <Field label={t.symptoms} value={d.consultation.symptoms[lang].join(', ')} />
              <Field label={t.severity} value={d.consultation.severity[lang]} />
              <Field label={t.onset} value={d.consultation.onset[lang]} />
              <Field label={t.changes} value={d.consultation.hasChanged ? t.yes : t.no} />
            </div>
          </div>
          {d.consultation.hasChanged && d.consultation.changeDescription && (
            <div className="mt-1">
              <Field label={t.changeDesc} value={d.consultation.changeDescription[lang]} />
            </div>
          )}
        </div>

        {/* Medical History */}
        <div className="mb-5">
          <SectionTitle>{t.medicalHistory}</SectionTitle>
          <Field
            label={t.allergies}
            value={d.history.hasAllergies ? (d.history.allergiesDescription || '') : t.none}
          />
          <Field
            label={t.medications}
            value={d.history.takesMedications ? (d.history.medicationsDescription || '') : t.none}
          />
          <Field
            label={t.selfTreatment}
            value={
              d.history.hasSelfTreated
                ? d.history.selfTreatmentDescription[lang]
                : t.no
            }
          />
          {d.history.additionalNotes && (
            <Field label={t.additionalNotes} value={d.history.additionalNotes[lang]} />
          )}
        </div>

        {/* Doctor's Assessment */}
        <div className="mb-6">
          <div
            className="p-5 rounded"
            style={{
              backgroundColor: '#f7f8fa',
              border: '1px solid #e2e4e8',
              borderLeft: '4px solid #2a5a8c',
            }}
          >
            <h2
              className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3"
              style={{ color: '#2a5a8c' }}
            >
              {t.assessment}
            </h2>
            <div className="flex gap-8 mb-3">
              <Field label={t.icd10} value={d.assessment.icd10Code} />
              <Field label={t.diagnosis} value={d.assessment.icd10Description[lang]} />
            </div>
            <div
              className="text-[10px] leading-[1.7] whitespace-pre-line mt-3 pt-3"
              style={{ color: '#1a1a1a', borderTop: '1px solid #d8dbe0' }}
            >
              {d.assessment.doctorResponse[lang]}
            </div>
            <div className="mt-4 pt-2 text-[10px] font-semibold" style={{ color: '#444', borderTop: '1px solid #d8dbe0' }}>
              {t.doctor}: {d.assessment.doctorName}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="p-3.5 rounded mb-6"
          style={{
            backgroundColor: '#fffbf0',
            border: '1px solid #e8dfc0',
          }}
        >
          <p className="text-[9px] font-semibold mb-1" style={{ color: '#8a7640' }}>
            {t.disclaimer}
          </p>
          <p className="text-[8.5px] leading-[1.6]" style={{ color: '#6b5f3a' }}>
            {t.disclaimerText}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex justify-between text-[8.5px] pt-2"
          style={{ color: '#999', borderTop: '1px solid #e0e0e0' }}
        >
          <span>
            {t.createdAt}: {d.createdAt}
          </span>
          <span>medena.at</span>
        </div>
      </div>
    </div>
  );
};

export default BefundberichtPreview;
