import { useParams, useSearchParams } from "react-router-dom";

const translations = {
  de: {
    cta: "Beratung starten",
    poweredBy: "Powered by",
    brandName: "Medena Care",
  },
  en: {
    cta: "Start Consultation",
    poweredBy: "Powered by",
    brandName: "Medena Care",
  },
};

// Predefined color options
const colorPresets: Record<string, string> = {
  primary: "#16a34a", // Green (default)
  blue: "#2563eb",
  purple: "#7c3aed",
  teal: "#0d9488",
  orange: "#ea580c",
  red: "#dc2626",
  slate: "#475569",
  black: "#18181b",
};

const Widget = () => {
  const { referralCode } = useParams<{ referralCode: string }>();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") === "en" ? "en" : "de";
  const t = translations[lang];

  // Get color from URL param - can be preset name or hex code
  const colorParam = searchParams.get("color") || "primary";
  const buttonColor = colorPresets[colorParam] || (colorParam.startsWith("#") ? colorParam : colorPresets.primary);

  const handleStartConsultation = () => {
    const baseUrl = window.location.origin;
    const consultationUrl = `${baseUrl}/consultation?ref=${referralCode}`;
    window.open(consultationUrl, "_blank");
  };

  const mainSiteUrl = "https://www.medena.at";

  return (
    <div className="w-full h-full min-h-[80px] flex flex-col items-center justify-center gap-2 p-3 font-sans bg-transparent">
      {/* CTA Button */}
      <button
        onClick={handleStartConsultation}
        style={{ backgroundColor: buttonColor }}
        className="w-full max-w-[280px] py-2.5 px-5 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        {t.cta} →
      </button>

      {/* Powered by link */}
      <p className="text-[11px] text-gray-500 italic">
        {t.poweredBy}{" "}
        <a
          href={mainSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 underline underline-offset-2"
        >
          {t.brandName}
        </a>
      </p>
    </div>
  );
};

export default Widget;
