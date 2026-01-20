import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-fade-up">
      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-12 h-12 rounded-full bg-card shadow-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Mobile CTA button */}
      <Button variant="floating" size="lg" className="md:hidden" asChild>
        <Link to="/consultation">
          {t("buttons.startNow")}
        </Link>
      </Button>
    </div>
  );
};

export default FloatingCTA;
