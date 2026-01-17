import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const features = [
  "Diagnosis by certified dermatologist",
  "Personalized treatment plan",
  "Prescription if medically necessary",
  "Follow-up recommendations",
  "Secure & confidential",
  "Response within 24 hours",
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 block">
              Simple Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              One Price, Complete Care
            </h2>
            <p className="text-lg text-muted-foreground">
              No hidden fees, no subscriptions. Just expert dermatology when you need it.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-card rounded-2xl shadow-elevated p-8 md:p-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 pb-8 border-b border-border">
                <div>
                  <p className="text-muted-foreground mb-2">Consultation Fee</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-foreground">€35</span>
                    <span className="text-muted-foreground">one-time</span>
                  </div>
                </div>
                <Button variant="hero" size="xl" className="group md:flex-shrink-0">
                  Start Consultation
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Insurance note */}
              <p className="text-sm text-muted-foreground mt-8 pt-6 border-t border-border">
                💡 Many health insurance plans reimburse telemedicine consultations. Check with your provider for coverage details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
