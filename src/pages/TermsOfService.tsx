import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const TermsOfService = () => {
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
            <span className="text-foreground">AGB</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Allgemeine Geschäftsbedingungen
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §1 Geltung, Begriffsdefinition
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) Die TeleDerm GmbH (in weiterer Folge „TeleDerm") betreibt unter der Webseite www.telederm.at eine Plattform zur Kommunikation zwischen Nutzern und Experten. Die nachfolgenden allgemeinen Geschäftsbedingungen gelten für sämtliche von uns gegenüber unseren Nutzern („Patienten") erbrachten Leistungen.
                </p>
                <p>
                  (2) Nutzer im Sinne dieser AGB ist jeder Anwender, der auf dieser Plattform registriert ist.
                </p>
                <p>
                  (3) Soweit nicht ausdrücklich Gegenteiliges vereinbart wurde, gelten unsere, dem Vertragspartner bekannt gegebenen AGB.
                </p>
                <p>
                  (4) Unser Vertragspartner stimmt zu, dass im Falle der Verwendung von AGB durch ihn im Zweifel von unseren Bedingungen auszugehen ist, auch wenn Bedingungen des Vertragspartners unwidersprochen bleiben.
                </p>
                <p>
                  (5) Vertragserfüllungshandlungen unsererseits gelten insofern nicht als Zustimmung zu von unseren Bedingungen abweichenden Vertragsbedingungen. Verbleiben bei der Vertragsauslegung dennoch Unklarheiten, so sind diese in der Weise auszuräumen, dass jene Inhalte als vereinbart gelten, die üblicherweise in vergleichbaren Fällen vereinbart werden.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §2 Zustandekommen eines Vertrages, Speicherung des Vertragstextes
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) Auf unserer Webseite kommt der Vertrag über die Nutzung unserer Plattform zustande, wenn Sie Ihren Namen und Ihre E-Mail-Adresse bei der Registrierung eingeben und den Button „Registrieren" anklicken.
                </p>
                <p>
                  (2) Im Falle des Vertragsschlusses kommt der Vertrag mit der
                </p>
                <address className="not-italic pl-4 border-l-2 border-primary/20">
                  TeleDerm GmbH<br />
                  Testgasse 1<br />
                  1010 Wien<br />
                  Österreich
                </address>
                <p>
                  zustande.
                </p>
                <p>
                  (3) Eingabefehler können mittels der üblichen Tastatur-, Maus-, Browser-Funktionen berichtigt werden. Sie können auch dadurch berichtigt werden, dass Sie den Registrierungsprozess vorzeitig abbrechen.
                </p>
                <p>
                  (4) Die Akzeptanz der AGB ist vor jedem Vertragsabschluss zu bestätigen.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §3 Gegenstand des Vertrages
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) Der Nutzer kann sich auf unserer Plattform, die 7 Tage, 24 Stunden lang, mit Ausnahme von angekündigten Abschaltungen oder höherer Gewalt in Betrieb ist, mit seinen Daten registrieren.
                </p>
                <p>
                  (2) Der Nutzer kann auf unserer Plattform an unsere Experten (Vertragspartner der Plattform) anamnestische Informationen über den bisherigen Krankheitsverlauf sowie bis zu vier Fotos der zu kontrollierenden Hautveränderungen über einen gesicherten Kommunikationsweg senden.
                </p>
                <p>
                  (3) Nach Nutzung der Bezahlfunktion werden die Daten übertragen und die erfolgreiche Übermittlung per E-Mail bestätigt. Der Experte erhält eine Benachrichtigung, dass die Anfrage eingegangen ist. Nach Öffnen des Links zu den Informationen werden die Fotos vom Experten begutachtet, anamnestische Informationen gelesen und weitere Therapievorschläge innerhalb von zwei Werktagen an den Nutzer gesendet. Die übermittelten Daten von und an den Nutzer werden gespeichert.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §4 Vergütung
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) Je erfolgter Anfrage an den Experten ist über die Bezahlfunktion der jeweils in der Anwendung angegebene Betrag (inkl. USt) an TeleDerm zu überweisen.
                </p>
                <p>
                  (2) Der Nutzer ist damit einverstanden, dass Rechnungen an ihn auch elektronisch erstellt und übermittelt werden.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §5 Pflichten des Nutzers
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    a) Registrierung
                  </h3>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>
                      (1) Voraussetzung für die Nutzung ist die kostenlose Registrierung.
                    </p>
                    <p>
                      (2) Der Nutzer verpflichtet sich, ausschließlich wahrheitsgemäße und vollständige Angaben zu seiner Person zu machen.
                    </p>
                    <p>
                      (3) Der Nutzer verpflichtet sich, die persönlichen Zugangsvoraussetzungen zu seinem persönlichen Bereich geheim zu halten und Missbrauch durch Dritte nach Möglichkeit zu verhindern.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    b) Nutzung der Plattform
                  </h3>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>
                      (1) Der Nutzer wird alles unterlassen, was zur Beeinträchtigung oder Beschädigung der Funktionsfähigkeit der Plattform führen kann.
                    </p>
                    <p>
                      (2) Der Experte verpflichtet sich, innerhalb von zwei Werktagen dem Nutzer auf seine übertragenen Daten verbindlich zu antworten.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    c) Haftungsfreistellung
                  </h3>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>
                      (1) Der Nutzer haftet bei der von ihm zu vertretenden Verletzung von Rechten Dritter gegenüber diesen selbst und unmittelbar.
                    </p>
                    <p>
                      (2) Der Nutzer verpflichtet sich, TeleDerm alle Schäden zu ersetzen, die wegen der schuldhaften Nichtbeachtung der sich aus diesem Nutzungsvertrag ergebenden Pflichten entstehen.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §6 Kündigung
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) Der Nutzungsvertrag wird auf unbestimmte Zeit geschlossen.
                </p>
                <p>
                  (2) Der Nutzungsvertrag kann vom Nutzer jederzeit gekündigt werden. Dabei reicht eine E-Mail an <a href="mailto:info@telederm.at" className="text-primary hover:underline">info@telederm.at</a>.
                </p>
                <p>
                  (3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund liegt insbesondere vor, wenn der Nutzer gegen diese AGB oder geltendes Recht verstößt.
                </p>
                <p>
                  (4) TeleDerm kann den Nutzungsvertrag unter Einhaltung einer Frist von zwei Wochen ohne Angabe von Gründen kündigen.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §7 Datenschutz, Vertraulichkeit
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) Für die Verarbeitung personenbezogener Daten gilt unsere <Link to="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>.
                </p>
                <p>
                  (2) TeleDerm und alle beteiligten Experten sind zur Verschwiegenheit über alle ihnen im Rahmen der Nutzung der Plattform bekannt gewordenen Informationen verpflichtet.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §8 Haftung
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) TeleDerm stellt ausschließlich eine technische Plattform zur Verfügung und übernimmt keine Verantwortung für medizinische Diagnosen, Behandlungen oder Empfehlungen. Die medizinische Verantwortung liegt ausschließlich bei den behandelnden Ärzten.
                </p>
                <p>
                  (2) Die Haftung von TeleDerm für leichte Fahrlässigkeit ist ausgeschlossen, sofern keine wesentlichen Vertragspflichten, Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit betroffen sind.
                </p>
                <p>
                  (3) Bei akuten oder lebensbedrohlichen Beschwerden ist unverzüglich der Notruf (144) oder die nächste Notaufnahme zu kontaktieren. Die Plattform ersetzt keinen ärztlichen Notdienst.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §9 Gerichtsstand, Anwendbares Recht
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) Es gilt ausschließlich österreichisches Recht unter Ausschluss des UN-Kaufrechts.
                </p>
                <p>
                  (2) Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Wien, sofern der Nutzer Unternehmer ist oder keinen allgemeinen Gerichtsstand in Österreich hat.
                </p>
                <p>
                  (3) Für Verbraucher gelten die zwingenden Bestimmungen des Konsumentenschutzgesetzes (KSchG).
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                §10 Schlussbestimmungen
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>
                  (1) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
                </p>
                <p>
                  (2) TeleDerm behält sich vor, diese AGB jederzeit zu ändern. Änderungen werden dem Nutzer per E-Mail mitgeteilt und gelten als genehmigt, wenn der Nutzer nicht innerhalb von 14 Tagen nach Zugang der Mitteilung widerspricht.
                </p>
              </div>
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

export default TermsOfService;
