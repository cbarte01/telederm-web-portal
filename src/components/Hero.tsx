import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shield, Smartphone } from "lucide-react";
import heroImage from "@/assets/hero-skin.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-screen background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
      
      {/* Decorative gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-up border border-card/30">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
            <span className="text-sm font-medium text-card">
              Certified Dermatologists • 24h Diagnosis
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-card mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Your Online Dermatologist,{" "}
            <span className="text-primary">Without the Wait</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-card/90 mb-10 max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Get expert skin diagnosis from certified dermatologists within 24 hours. 
            No appointments, no waiting rooms — just professional care from your phone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" className="group">
              Start Your Consultation
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="bg-transparent border-card/50 text-card hover:bg-card/10 hover:text-card"
            >
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 bg-card/10 backdrop-blur-sm rounded-full px-4 py-2 border border-card/20">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card">24h Diagnosis</span>
            </div>
            <div className="flex items-center gap-2 bg-card/10 backdrop-blur-sm rounded-full px-4 py-2 border border-card/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-card/10 backdrop-blur-sm rounded-full px-4 py-2 border border-card/20">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card">100% Digital</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
