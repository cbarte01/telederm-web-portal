import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Clock, Zap, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";

const planConfigs = [
  {
    key: "standard",
    icon: Clock,
    price: "35",
    responseTime: "48 hours",
    popular: false,
  },
  {
    key: "urgent",
    icon: Zap,
    price: "49",
    responseTime: "24 hours",
    popular: true,
  },
  {
    key: "expert",
    icon: Crown,
    price: "73",
    responseTime: "24 hours",
    popular: false,
  },
];

const Pricing = () => {
  const { t } = useTranslation("home");

  return (
    <section id="pricing" className="section-padding bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
            {t("pricing.label")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 text-balance">
            {t("pricing.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("pricing.description")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {planConfigs.map((plan) => {
            const features = t(`pricing.plans.${plan.key}.features`, { returnObjects: true }) as string[];
            
            return (
              <div
                key={plan.key}
                className={`relative bg-card rounded-2xl p-7 lg:p-8 transition-all duration-400 ${
                  plan.popular
                    ? "shadow-elevated border-2 border-primary md:-translate-y-2"
                    : "shadow-soft border border-border/60 hover:shadow-card hover:-translate-y-1"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    plan.popular ? "gradient-hero" : "bg-primary/10"
                  }`}>
                    <plan.icon className={`w-6 h-6 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {t(`pricing.plans.${plan.key}.name`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed min-h-[4.5rem]">
                    {t(`pricing.plans.${plan.key}.description`)}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-serif font-bold text-foreground">€{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{t("pricing.oneTime")}</span>
                  </div>
                  <p className="text-sm text-primary font-medium mt-2">
                    {t("pricing.responseWithin", { time: plan.responseTime })}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular ? "bg-primary" : "bg-primary/10"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                      </div>
                      <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  size="lg"
                  className={`w-full group ${
                    plan.popular ? "shadow-soft" : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {t("pricing.selectPlan", "Select Plan")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Insurance Note */}
        <p className="text-sm text-muted-foreground text-center mt-10 max-w-2xl mx-auto">
          {t("pricing.note")}
        </p>
      </div>
    </section>
  );
};

export default Pricing;
