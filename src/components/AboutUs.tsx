import { useTranslation } from "react-i18next";
import { Heart, Shield, Zap, Users, Circle } from "lucide-react";

const valueIcons = [Heart, Shield, Zap, Users];
const valueKeys = ["patientCentered", "privacy", "innovation", "accessibility"];
const milestoneKeys = ["2000", "2003", "2006", "2010", "2015", "2018", "2020", "2022", "2024", "today"];

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

        {/* History Timeline */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              {t("about.history.title")}
            </h3>
            <p className="text-lg text-muted-foreground font-light">
              {t("about.history.subtitle")}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8 md:space-y-12">
              {milestoneKeys.map((key, index) => (
                <div 
                  key={key}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-4 border-background shadow-sm z-10" />

                  {/* Content card */}
                  <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:text-left"
                  }`}>
                    <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/40 hover:shadow-card transition-all duration-400">
                      <div className={`flex items-center gap-3 mb-3 ${
                        index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                      }`}>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {t(`about.history.milestones.${key}.year`)}
                        </span>
                      </div>
                      <h4 className="text-xl text-foreground mb-2">
                        {t(`about.history.milestones.${key}.title`)}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed font-light">
                        {t(`about.history.milestones.${key}.description`)}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;