import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

const conditionKeys = ["acne", "eczema", "psoriasis", "rosacea", "skinRashes", "hairLoss"];

const Conditions = () => {
  const { t } = useTranslation("home");

  return (
    <section id="conditions" className="section-padding">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
              {t("conditions.label")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-7 text-balance">
              {t("conditions.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("conditions.description")}
            </p>
          </div>

          {/* Right - Conditions Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {conditionKeys.map((key) => (
              <div
                key={key}
                className="p-6 rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-card transition-all duration-400 cursor-pointer group"
              >
                <h3 className="font-serif font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {t(`conditions.featured.${key}.name`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`conditions.featured.${key}.description`)}
                </p>
              </div>
            ))}
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
