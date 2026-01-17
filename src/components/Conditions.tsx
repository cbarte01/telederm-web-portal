import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              {t("conditions.description")}
            </p>
            <Button variant="hero" size="lg" className="group shadow-soft" asChild>
              <Link to="/conditions">
                {t("conditions.viewAll", "View All Conditions")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
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
      </div>
    </section>
  );
};

export default Conditions;
