import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Clock, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Standard Request",
    icon: Clock,
    description: "A skin concern has recently appeared and you want a professional assessment and recommendation? This is the right option for you!",
    price: "35",
    responseTime: "48 hours",
    features: [
      "Full reimbursement for private insurance",
      "Response within 48 hours (weekdays)",
      "Prescription if medically necessary",
      "Home delivery of medication*",
    ],
    popular: false,
  },
  {
    name: "Urgent Request",
    icon: Zap,
    description: "Need an urgent assessment of your skin concerns? Waiting is not an option? Get a response from a skin specialist within 24 hours on weekdays — and even on weekends!",
    price: "49",
    responseTime: "24 hours",
    features: [
      "Full reimbursement for private insurance",
      "Response within 24 hours (weekdays)",
      "Prescription if medically necessary",
      "Home delivery of medication*",
      "One follow-up question included",
    ],
    popular: true,
  },
  {
    name: "Expert Treatment",
    icon: Crown,
    description: "Have a persistent skin problem where treatment hasn't worked? Our specialists will take care of your issue and create an individualized treatment plan.",
    price: "73",
    responseTime: "24 hours",
    features: [
      "Full reimbursement for private insurance",
      "Response within 24 hours (weekdays)",
      "Prescription if medically necessary",
      "Home delivery of medication*",
      "Multiple follow-up questions",
      "Individualized treatment plan",
      "Detailed medical report",
    ],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="section-padding bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
            Pricing Plans
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 text-balance">
            Choose Your Care Level
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transparent pricing with no hidden fees. Select the plan that best fits your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
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
                    Most Popular
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
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed min-h-[4.5rem]">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-5xl font-serif font-bold text-foreground">€{plan.price}</span>
                  <span className="text-muted-foreground text-sm">one-time</span>
                </div>
                <p className="text-sm text-primary font-medium mt-2">
                  Response within {plan.responseTime}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
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
                Select Plan
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>

        {/* Insurance Note */}
        <p className="text-sm text-muted-foreground text-center mt-10 max-w-2xl mx-auto">
          *Price of medication not included. Many health insurance plans reimburse telemedicine consultations — check with your provider for coverage details.
        </p>
      </div>
    </section>
  );
};

export default Pricing;