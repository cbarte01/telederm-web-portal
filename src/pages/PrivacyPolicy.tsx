import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const PrivacyPolicy = () => {
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
            <span className="text-foreground">Datenschutz</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Datenschutzerklärung
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der geltenden gesetzlichen Bestimmungen (DSGVO, DSG, GTelG). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website und Plattform.
            </p>

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                1. Verantwortlicher
              </h2>
              <address className="not-italic text-muted-foreground leading-relaxed">
                TeleDerm GmbH<br />
                Testgasse 1<br />
                1010 Wien<br />
                Österreich<br />
                E-Mail: <a href="mailto:info@telederm.at" className="text-primary hover:underline">info@telederm.at</a>
              </address>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                2. Datenschutzbeauftragter
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ein Datenschutzbeauftragter ist gemäß Art. 37 DSGVO nicht bestellt.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                3. Rolle von TeleDerm GmbH
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                TeleDerm GmbH ist kein Gesundheitsdienstleister und erbringt keine medizinischen Leistungen. Wir betreiben eine technische Plattform zur Vermittlung zwischen Patienten und in Österreich zugelassenen Ärzten. Die medizinische Verantwortung liegt ausschließlich beim behandelnden Arzt.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                4. Verarbeitung personenbezogener Daten
              </h2>

              <div className="ml-4 space-y-8">
                {/* 4.1 */}
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    4.1 Websitebesuch
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Beim Aufruf unserer Website werden Server-Logfiles verarbeitet. Zweck ist die Systemsicherheit.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.
                  </p>
                </div>

                {/* 4.2 */}
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    4.2 Kontaktaufnahme
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    Bei Kontaktaufnahme verarbeiten wir Name, E-Mail-Adresse und Inhalt der Anfrage.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO.
                  </p>
                </div>

                {/* 4.3 */}
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    4.3 Patientenportal und Gesundheitsdaten
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Im Rahmen des Patientenportals verarbeiten wir personenbezogene Daten einschließlich Gesundheitsdaten (Art. 9 DSGVO), Freitexteingaben und hochgeladene Bilder. Es erfolgen keine Video- oder Audioaufzeichnungen.
                  </p>
                  <div className="text-muted-foreground leading-relaxed mb-2">
                    <strong>Rechtsgrundlagen:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Art. 6 Abs. 1 lit. b DSGVO</li>
                      <li>Art. 9 Abs. 2 lit. a DSGVO</li>
                      <li>Art. 9 Abs. 2 lit. h DSGVO</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Speicherdauer:</strong> bis zu 10 Jahre.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                5. Einwilligungserklärung (Checkbox)
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Die Verarbeitung von Gesundheitsdaten erfolgt ausschließlich auf Basis Ihrer ausdrücklichen Einwilligung. Im Rahmen der Nutzung des Patientenportals verwenden wir folgende Einwilligungserklärung.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                6. Weitergabe von Daten
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Eine Weitergabe erfolgt ausschließlich an ausgewählte Ärzte, technische Dienstleister sowie Behörden bei gesetzlicher Verpflichtung.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                7. Datenübermittlung
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Die Plattform wird in der EU (Frankfurt) betrieben. Unterstützende Dienste (z. B. E-Mail, Domainhosting) können Anbieter außerhalb der EU einsetzen. In diesen Fällen erfolgt die Übermittlung auf Basis geeigneter Garantien gemäß Art. 46 DSGVO.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                8. Webanalyse / Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Unsere Website verwendet Google Analytics ausschließlich nach Ihrer ausdrücklichen Einwilligung über ein Cookie-Consent-Tool.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                9. Zahlungsabwicklung
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Zahlungen erfolgen über Stripe Payments Europe Ltd.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                10. Datensicherheit
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Wir setzen geeignete technische und organisatorische Maßnahmen ein, um Ihre Daten zu schützen.
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                11. Ihre Rechte
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                12. Widerruf von Einwilligungen
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Erteilte Einwilligungen können jederzeit mit Wirkung für die Zukunft widerrufen werden.
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                13. Beschwerderecht
              </h2>
              <address className="not-italic text-muted-foreground leading-relaxed">
                Österreichische Datenschutzbehörde<br />
                Barichgasse 40–42<br />
                1030 Wien<br />
                <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  www.dsb.gv.at
                </a>
              </address>
            </section>

            {/* Section 14 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                14. Änderungen
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Diese Datenschutzerklärung kann angepasst werden.
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

export default PrivacyPolicy;
