import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Clock, Shield, Smartphone } from "lucide-react";
import heroImage from "@/assets/hero-skin.jpg";
const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const {
    t
  } = useTranslation("home");
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full-screen background image with parallax */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110" style={{
      backgroundImage: `url(${heroImage})`,
      transform: `translateY(${scrollY * 0.4}px) scale(1.1)`
    }} />
      
      {/* Warm, sophisticated overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/65 to-foreground/35" />
      
      {/* Decorative warm gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent" />

      <div className="container relative z-10 pt-28 pb-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-card/15 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 animate-fade-up border border-card/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
            <span className="text-sm font-medium text-card/95 tracking-wide">
              {t("hero.badge")}
            </span>
          </div>

          {/* Headline - using serif font */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-card mb-8 animate-fade-up leading-[1.1]" style={{
          animationDelay: "0.1s"
        }}>
            {t("hero.title")}{" "}
            <span className="text-primary">{t("hero.titleHighlight")}</span>
          </h1>

          {/* Subheadline - better readability */}
          <p className="text-lg md:text-xl text-card/85 mb-12 max-w-xl animate-fade-up leading-relaxed font-normal" style={{
          animationDelay: "0.2s"
        }}>
            {t("hero.description")}
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14 animate-fade-up" style={{
          animationDelay: "0.3s"
        }}>
            <Button variant="hero" size="xl" className="group shadow-elevated">
              {t("common:buttons.startConsultation")}
            </Button>
          </div>

          {/* Trust indicators - refined styling */}
          <div className="flex flex-wrap gap-3 animate-fade-up" style={{
          animationDelay: "0.4s"
        }}>
            <div className="flex items-center gap-2.5 bg-card/10 backdrop-blur-md rounded-full px-5 py-2.5 border border-card/15">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card/90">{t("hero.trustBadges.diagnosis")}</span>
            </div>
            <div className="flex items-center gap-2.5 bg-card/10 backdrop-blur-md rounded-full px-5 py-2.5 border border-card/15">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card/90">{t("hero.trustBadges.gdpr")}</span>
            </div>
            <div className="flex items-center gap-2.5 bg-card/10 backdrop-blur-md rounded-full px-5 py-2.5 border border-card/15">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-card/90">{t("hero.trustBadges.digital")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;