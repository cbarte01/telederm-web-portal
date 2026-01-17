import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, Smartphone } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
      
      {/* Decorative circles */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 mb-6 animate-fade-up">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
            <span className="text-sm font-medium text-secondary-foreground">
              Certified Dermatologists • 24h Diagnosis
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Your Online Dermatologist,{" "}
            <span className="text-primary">Without the Wait</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Get expert skin diagnosis from certified dermatologists within 24 hours. 
            No appointments, no waiting rooms — just professional care from your phone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" className="group">
              Start Your Consultation
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="hero-outline" size="xl">
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card shadow-soft">
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">24h Diagnosis</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card shadow-soft">
              <Shield className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">GDPR Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card shadow-soft">
              <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">100% Digital</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
