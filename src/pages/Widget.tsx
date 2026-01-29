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

const Widget = () => {
  const { referralCode } = useParams<{ referralCode: string }>();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") === "en" ? "en" : "de";
  const t = translations[lang];

  // Get hex color from URL param (default to green)
  const colorParam = searchParams.get("color") || "#16a34a";
  const buttonColor = colorParam.startsWith("#") ? colorParam : `#${colorParam}`;

  const handleStartConsultation = () => {
    const baseUrl = window.location.origin;
    const consultationUrl = `${baseUrl}/consultation?ref=${referralCode}`;
    window.open(consultationUrl, "_blank");
  };

  const mainSiteUrl = "https://www.medena.at";

  return (
    <div className="w-full h-full min-h-[60px] flex flex-col items-center justify-center gap-1 p-2 font-sans bg-transparent">
      {/* CTA Button */}
      <button
        onClick={handleStartConsultation}
        style={{ backgroundColor: buttonColor }}
        className="w-full max-w-[220px] py-2 px-4 text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        {t.cta} →
      </button>

      {/* Powered by link */}
      <p className="text-[10px] text-gray-500 italic">
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
