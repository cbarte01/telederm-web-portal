const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    company: [
      { label: "About Us", href: "#" },
      { label: "Our Doctors", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
    support: [
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#" },
      { label: "How It Works", href: "#how-it-works" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Imprint", href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-background/80 py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl text-background">telederm</span>
            </div>
            <p className="text-sm text-background/60 max-w-xs">
              Professional dermatology care, delivered digitally. Your skin deserves expert attention.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-background mb-4">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
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

          {/* Support */}
          <div>
            <h4 className="font-semibold text-background mb-4">Support</h4>
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
            <h4 className="font-semibold text-background mb-4">Legal</h4>
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
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © {currentYear} Telederm. All rights reserved.
          </p>
          <p className="text-xs text-background/40">
            Medical consultations provided by licensed dermatologists.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
