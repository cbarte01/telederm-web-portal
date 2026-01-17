import { useTranslation } from "react-i18next";
import { Heart, Shield, Zap, Users } from "lucide-react";

const valueIcons = [Heart, Shield, Zap, Users];
const valueKeys = ["patientCentered", "privacy", "innovation", "accessibility"];

const AboutUs = () => {
  const { t } = useTranslation("home");

  return (
    <section id="about" className="section-padding gradient-warm">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-5">
              {t("about.label")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-7">
              {t("about.title")}
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>{t("about.paragraphs.p1")}</p>
              <p>{t("about.paragraphs.p2")}</p>
              <p>{t("about.paragraphs.p3")}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-border">
              <div>
                <div className="text-3xl lg:text-4xl font-serif font-bold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground mt-1">{t("about.stats.patients")}</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-serif font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground mt-1">{t("about.stats.dermatologists")}</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-serif font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground mt-1">{t("about.stats.rating")}</div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-5">
            {valueKeys.map((key, index) => {
              const Icon = valueIcons[index];
              return (
                <div
                  key={key}
                  className="bg-card rounded-2xl p-7 shadow-soft hover:shadow-card transition-all duration-400 border border-border/50"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-2">
                    {t(`about.values.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`about.values.${key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 gradient-hero rounded-3xl p-10 md:p-14 text-center shadow-elevated">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-primary-foreground mb-5">
            {t("about.mission.title")}
          </h3>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            {t("about.mission.quote")}
          </p>
          <p className="text-primary-foreground/70 mt-5 font-medium">{t("about.mission.attribution")}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;