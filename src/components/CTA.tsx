import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  const { t } = useTranslation("home");

  return (
    <section className="section-padding gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(174_62%_40%/0.25)_100%)]" />
      <div className="absolute top-12 left-12 w-36 h-36 border border-primary-foreground/8 rounded-full" />
      <div className="absolute bottom-12 right-12 w-56 h-56 border border-primary-foreground/8 rounded-full" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-8 text-balance">
            {t("cta.title")}
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/75 mb-10 max-w-2xl mx-auto font-light">
            {t("cta.description")}
          </p>
          <Button
            variant="hero"
            size="xl"
            className="bg-card text-foreground hover:bg-card/90 shadow-elevated group font-semibold"
          >
            {t("cta.button")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
