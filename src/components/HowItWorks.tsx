import { Camera, FileText, Stethoscope, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stepIcons = [Camera, FileText, Stethoscope];
const stepKeys = ["step1", "step2", "step3"];

const HowItWorks = () => {
  const { t } = useTranslation("home");

  return (
    <section id="how-it-works" className="section-padding bg-secondary/20">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">
            {t("howItWorks.label")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
            {t("howItWorks.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            {t("howItWorks.description")}
          </p>
          <div className="section-divider" />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
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
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-border/60" />
                )}

                <div className="relative bg-card rounded-2xl p-10 lg:p-12 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 border border-border/40">
                  {/* Step number */}
                  <span className="absolute -top-4 -right-2 w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                    {stepNumber}
                  </span>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-8 shadow-sm">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl text-foreground mb-4">
                    {t(`howItWorks.steps.${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed font-light">
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
            <Link to="/consultation">
              {t("howItWorks.cta")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
