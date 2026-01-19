import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

// Map condition keys to their first letter for anchor navigation (EN and DE)
const conditionConfigs = [
  { key: "acne", letterEN: "A", letterDE: "A" }, // Acne / Akne
  { key: "eczema", letterEN: "E", letterDE: "E" }, // Eczema / Ekzem
  { key: "psoriasis", letterEN: "P", letterDE: "S" }, // Psoriasis / Schuppenflechte
  { key: "rosacea", letterEN: "R", letterDE: "R" }, // Rosacea / Rosazea
  { key: "skinRashes", letterEN: "S", letterDE: "H" }, // Skin Rashes / Hautausschläge
  { key: "hairLoss", letterEN: "H", letterDE: "H" }, // Hair Loss / Haarausfall
];

const Conditions = () => {
  const { t, i18n } = useTranslation("home");
  const isGerman = i18n.language === "de";

  return (
    <section id="conditions" className="section-padding">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Content */}
          <div>
            <span className="section-label">
              {t("conditions.label")}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 text-balance">
              {t("conditions.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              {t("conditions.description")}
            </p>
          </div>

          {/* Right - Conditions Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {conditionConfigs.map(({ key, letterEN, letterDE }) => {
              const letter = isGerman ? letterDE : letterEN;
              return (
                <Link
                  key={key}
                  to={`/conditions#letter-${letter}`}
                  className="p-7 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-card transition-all duration-400 cursor-pointer group block"
                >
                  <h3 className="text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {t(`conditions.featured.${key}.name`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {t(`conditions.featured.${key}.description`)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/conditions"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {t("conditions.viewAll", "View All Conditions")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Conditions;
