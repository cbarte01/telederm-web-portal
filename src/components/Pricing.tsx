import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Clock, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

// Hard-coded public pricing - admin_settings table is now restricted to admins only
const PUBLIC_PRICING = {
  standard_price: 49,
  urgent_price: 74,
};

const Pricing = () => {
  const { t, i18n } = useTranslation("home");
  const lang = i18n.language === "de" ? "de" : "en";

  const planConfigs = [
    {
      key: "standard",
      icon: Clock,
      price: PUBLIC_PRICING.standard_price,
      responseTime: lang === "de" ? "48 Stunden" : "48 hours",
      popular: false,
    },
    {
      key: "urgent",
      icon: Zap,
      price: PUBLIC_PRICING.urgent_price,
      responseTime: lang === "de" ? "24 Stunden" : "24 hours",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-secondary/20">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-label">
            {t("pricing.label")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
            {t("pricing.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            {t("pricing.description")}
          </p>
          <div className="section-divider" />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
              {planConfigs.map((plan) => {
                const features = t(`pricing.plans.${plan.key}.features`, { returnObjects: true }) as string[];
                
                return (
                  <div
                    key={plan.key}
                    className={`relative bg-card rounded-2xl p-8 lg:p-10 transition-all duration-400 ${
                      plan.popular
                        ? "shadow-elevated border-2 border-primary md:-translate-y-3"
                        : "shadow-soft border border-border/50 hover:shadow-card hover:-translate-y-1"
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.15em] px-5 py-1.5 rounded-full shadow-md">
                          {t("pricing.mostPopular")}
                        </span>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-8">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                        plan.popular ? "gradient-hero" : "bg-primary/8"
                      }`}>
                        <plan.icon className={`w-7 h-7 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                      </div>
                      <h3 className="text-2xl text-foreground mb-3">
                        {t(`pricing.plans.${plan.key}.name`)}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed min-h-[4.5rem] font-light">
                        {t(`pricing.plans.${plan.key}.description`)}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-8 pb-8 border-b border-border/60">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-5xl lg:text-6xl font-serif font-semibold text-foreground">€{plan.price}</span>
                        <span className="text-muted-foreground text-sm font-light">{t("pricing.oneTime")}</span>
                      </div>
                      <p className="text-sm text-primary font-medium mt-3">
                        {t("pricing.responseWithin", { time: plan.responseTime })}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.popular ? "bg-primary" : "bg-primary/10"
                          }`}>
                            <Check className={`w-3 h-3 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                          </div>
                          <span className="text-base text-foreground leading-relaxed font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Centralized CTA Button */}
            <div className="flex justify-center mt-10">
              <Button
                variant="hero"
                size="xl"
                className="shadow-soft group"
                asChild
              >
                <Link to="/consultation">
                  {t("pricing.startTreatment", "Start Treatment")}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Insurance Note */}
            <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
              {t("pricing.note")}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default Pricing;
