import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Impressum</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Impressum
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            {/* Section 1: Company Information */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Angaben gemäß § 5 ECG
              </h2>
              <address className="not-italic text-muted-foreground leading-relaxed">
                <strong className="text-foreground">TeleDerm GmbH</strong><br />
                Testgasse 1<br />
                1010 Wien<br />
                Österreich
              </address>
            </section>

            {/* Section 2: Contact */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Kontakt
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-1">
                <p>
                  E-Mail: <a href="mailto:info@telederm.at" className="text-primary hover:underline">info@telederm.at</a>
                </p>
              </div>
            </section>

            {/* Section 3: Company Registration */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Firmenbuchdaten
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-1">
                <p><strong>Firmenbuchnummer:</strong> FN XXXXXX x</p>
                <p><strong>Firmenbuchgericht:</strong> Handelsgericht Wien</p>
                <p><strong>UID-Nummer:</strong> ATU XXXXXXXX</p>
              </div>
            </section>

            {/* Section 4: Management */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Geschäftsführung
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                [Name der Geschäftsführung]
              </p>
            </section>

            {/* Section 5: Regulatory Authority */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Aufsichtsbehörde
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Magistrat der Stadt Wien
              </p>
            </section>

            {/* Section 6: Business Purpose */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Unternehmensgegenstand
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Betrieb einer technischen Plattform zur Vermittlung von telemedizinischen Konsultationen zwischen Patienten und in Österreich zugelassenen Ärzten. TeleDerm GmbH erbringt selbst keine medizinischen Leistungen.
              </p>
            </section>

            {/* Section 7: Professional Regulations */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Berufsrechtliche Vorschriften
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-2">Anwendbare Vorschriften:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>E-Commerce-Gesetz (ECG)</li>
                  <li>Gewerbeordnung (GewO)</li>
                  <li>Datenschutz-Grundverordnung (DSGVO)</li>
                  <li>Gesundheitstelematikgesetz (GTelG)</li>
                </ul>
              </div>
            </section>

            {/* Section 8: Liability Disclaimer */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Haftungsausschluss
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    Haftung für Inhalte
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 ECG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    Haftung für Links
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    Medizinischer Haftungsausschluss
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    TeleDerm GmbH stellt ausschließlich eine technische Plattform zur Verfügung und übernimmt keine Verantwortung für medizinische Diagnosen, Behandlungen oder Empfehlungen. Die medizinische Verantwortung liegt ausschließlich bei den behandelnden Ärzten. Bei akuten oder lebensbedrohlichen Beschwerden wenden Sie sich bitte umgehend an den Notruf (144) oder die nächste Notaufnahme.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9: Copyright */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Urheberrecht
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
            </section>

            {/* Section 10: Dispute Resolution */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Streitschlichtung
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            {/* Date */}
            <p className="text-sm text-muted-foreground mt-12 pt-8 border-t border-border">
              Stand: März 2026
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Impressum;
