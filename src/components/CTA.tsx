import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 md:py-28 gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(174_62%_40%/0.3)_100%)]" />
      <div className="absolute top-10 left-10 w-32 h-32 border border-primary-foreground/10 rounded-full" />
      <div className="absolute bottom-10 right-10 w-48 h-48 border border-primary-foreground/10 rounded-full" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 text-balance">
            Take the First Step Towards Healthier Skin
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who've discovered convenient, professional dermatology care from home.
          </p>
          <Button
            variant="default"
            size="xl"
            className="bg-background text-foreground hover:bg-background/90 shadow-elevated group"
          >
            Start Your Consultation Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
