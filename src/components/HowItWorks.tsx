import { Camera, FileText, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const stepIcons = [Camera, FileText, Stethoscope];
const stepKeys = ["step1", "step2", "step3"];

const HowItWorks = () => {
  const { t } = useTranslation("home");

  return (
    <section id="how-it-works" className="section-padding bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
            {t("howItWorks.label")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 text-balance">
            {t("howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("howItWorks.description")}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-14">
          {stepKeys.map((key, index) => {
            const Icon = stepIcons[index];
            const stepNumber = String(index + 1).padStart(2, "0");

            return (
              <div
                key={key}
                className="relative group"
              >
                {/* Connector line (hidden on mobile) */}
                {index < stepKeys.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-border" />
                )}

                <div className="relative bg-card rounded-2xl p-8 lg:p-10 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 border border-border/50">
                  {/* Step number */}
                  <span className="absolute -top-4 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {stepNumber}
                  </span>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-7 shadow-sm">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                    {t(`howItWorks.steps.${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`howItWorks.steps.${key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button variant="hero" size="xl" asChild>
            <a href="#contact">{t("howItWorks.cta")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
