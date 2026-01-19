import { useTranslation } from "react-i18next";
import { Heart, Shield, Zap, Users } from "lucide-react";

const valueIcons = [Heart, Shield, Zap, Users];
const valueKeys = ["patientCentered", "privacy", "innovation", "accessibility"];

const AboutUs = () => {
  const { t } = useTranslation("home");

  return (
    <section id="about" className="section-padding gradient-warm">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div>
            <span className="section-label">
              {t("about.label")}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
              {t("about.title")}
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed font-light">
              <p>{t("about.paragraphs.p1")}</p>
              <p>{t("about.paragraphs.p2")}</p>
              <p>{t("about.paragraphs.p3")}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-10 mt-12 pt-12 border-t border-border/60">
              <div>
                <div className="text-4xl lg:text-5xl font-serif font-semibold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground mt-2 font-light">{t("about.stats.patients")}</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-serif font-semibold text-primary">20+</div>
                <div className="text-sm text-muted-foreground mt-2 font-light">{t("about.stats.dermatologists")}</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-serif font-semibold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground mt-2 font-light">{t("about.stats.rating")}</div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-6">
            {valueKeys.map((key, index) => {
              const Icon = valueIcons[index];
              return (
                <div
                  key={key}
                  className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-400 border border-border/40"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl text-foreground mb-3">
                    {t(`about.values.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {t(`about.values.${key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-24 gradient-hero rounded-3xl p-12 md:p-16 text-center shadow-elevated">
          <h3 className="text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
            {t("about.mission.title")}
          </h3>
          <p className="text-lg md:text-xl text-primary-foreground/85 max-w-3xl mx-auto leading-relaxed font-light">
            {t("about.mission.quote")}
          </p>
          <p className="text-primary-foreground/65 mt-6 font-medium">{t("about.mission.attribution")}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;