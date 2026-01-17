import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isForDoctorsPage = location.pathname === "/for-doctors";
  const { t } = useTranslation("common");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#how-it-works", label: t("nav.howItWorks") },
    { href: "/#conditions", label: t("nav.conditions") },
    { href: "/#pricing", label: t("nav.pricing") },
    { href: "/#faq", label: t("nav.faq") },
  ];

  const pageLinks = [
    { href: "/skin-blog", label: t("nav.skinBlog") },
    { href: "/for-doctors", label: t("nav.forDoctors") },
  ];

  // Determine header style based on scroll and page
  const showTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showTransparent
          ? "bg-transparent"
          : "bg-card/95 backdrop-blur-lg shadow-soft border-b border-border/50"
      }`}
    >
      <div className="container flex items-center justify-between h-18 md:h-22">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img 
            src={teledermLogo} 
            alt="Telederm" 
            className="w-9 h-9 rounded-lg"
          />
          <span className={`font-serif font-bold text-xl transition-colors duration-300 ${
            showTransparent ? 'text-card' : 'text-foreground'
          }`}>telederm</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
            className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${
                showTransparent ? 'text-card/80 hover:text-card' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </a>
          ))}
          {pageLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${
                location.pathname === link.href 
                  ? 'text-primary' 
                  : showTransparent ? 'text-card/80 hover:text-card' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Language Switcher + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher variant={showTransparent ? 'transparent' : 'default'} />
          {!isForDoctorsPage && (
            <Button variant="hero" size="lg">
              {t("buttons.startTreatment")}
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <nav className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            {!isForDoctorsPage && (
              <Button variant="hero" size="lg" className="mt-2">
                {t("buttons.startTreatment")}
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
