import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Lock, Award, BadgeCheck } from "lucide-react";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation("common");
  const location = useLocation();
  const isForDoctorsPage = location.pathname === "/for-doctors";

  const links = {
    company: [
      { label: t("footer.aboutUs"), href: isForDoctorsPage ? "/for-doctors#about" : "/#about" },
      { label: t("footer.ourDoctors"), href: "/#doctors" },
    ],
    services: [
      { label: t("footer.forPatients"), href: "/", isRoute: true },
      { label: t("nav.forDoctors"), href: "/for-doctors", isRoute: true },
      { label: t("footer.forCompanies"), href: "#" },
    ],
    support: [
      { label: t("nav.faq"), href: "/#faq" },
      { label: t("footer.contact"), href: "/#contact" },
    ],
    legal: [
      { label: t("footer.privacyPolicy"), href: "#" },
      { label: t("footer.termsOfService"), href: "#" },
      { label: t("footer.imprint"), href: "#" },
    ],
  };

  const certificates = [
    { label: t("certificates.gdpr"), icon: ShieldCheck },
    { label: t("certificates.iso"), icon: Lock },
    { label: t("certificates.telemedicine"), icon: Award },
    { label: t("certificates.ce"), icon: BadgeCheck },
  ];

  return (
    <footer className="bg-foreground text-background/80 py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={teledermLogo} 
                alt="Telederm" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-bold text-xl text-background">telederm</span>
            </Link>
            <p className="text-sm text-background/60 max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-background mb-4">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  {'isRoute' in link && link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm hover:text-background transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-background mb-4">{t("footer.services")}</h4>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.label}>
                  {'isRoute' in link && link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm hover:text-background transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-background mb-4">{t("footer.support")}</h4>
            <ul className="space-y-3">
              {links.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-background mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificates */}
          <div>
            <h4 className="font-semibold text-background mb-4">{t("footer.certifications")}</h4>
            <ul className="space-y-3">
              {certificates.map((cert) => (
                <li key={cert.label} className="flex items-center gap-2">
                  <cert.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{cert.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            {t("footer.copyright", { year: currentYear })}
          </p>
          <p className="text-xs text-background/40">
            {t("footer.medicalDisclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
