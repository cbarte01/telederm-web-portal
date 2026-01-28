import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TermsOfService = () => {
  const { t, i18n } = useTranslation("legal");
  const isEnglish = i18n.language === "en";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              {t("breadcrumb.home")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{t("termsOfService.breadcrumb")}</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {t("termsOfService.title")}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">

            {/* Translation Disclaimer for English */}
            {isEnglish && (
              <Alert className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  {t("translationDisclaimer")}
                </AlertDescription>
              </Alert>
            )}

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section1.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section1.p1")}</p>
                <p>(2) {t("termsOfService.section1.p2")}</p>
                <p>(3) {t("termsOfService.section1.p3")}</p>
                <p>(4) {t("termsOfService.section1.p4")}</p>
                <p>(5) {t("termsOfService.section1.p5")}</p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section2.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section2.p1")}</p>
                <p>(2) {t("termsOfService.section2.p2")}</p>
                <address className="not-italic pl-4 border-l-2 border-primary/20">
                  Medena Care GmbH<br />
                  Testgasse 1<br />
                  1010 {isEnglish ? "Vienna" : "Wien"}<br />
                  {isEnglish ? "Austria" : "Österreich"}
                </address>
                <p>{t("termsOfService.section2.p3")}</p>
                <p>(3) {t("termsOfService.section2.p4")}</p>
                <p>(4) {t("termsOfService.section2.p5")}</p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section3.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section3.p1")}</p>
                <p>(2) {t("termsOfService.section3.p2")}</p>
                <p>(3) {t("termsOfService.section3.p3")}</p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section4.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section4.p1")}</p>
                <p>(2) {t("termsOfService.section4.p2")}</p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section5.title")}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("termsOfService.section5.registration.title")}
                  </h3>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>(1) {t("termsOfService.section5.registration.p1")}</p>
                    <p>(2) {t("termsOfService.section5.registration.p2")}</p>
                    <p>(3) {t("termsOfService.section5.registration.p3")}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("termsOfService.section5.usage.title")}
                  </h3>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>(1) {t("termsOfService.section5.usage.p1")}</p>
                    <p>(2) {t("termsOfService.section5.usage.p2")}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("termsOfService.section5.liability.title")}
                  </h3>
                  <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>(1) {t("termsOfService.section5.liability.p1")}</p>
                    <p>(2) {t("termsOfService.section5.liability.p2")}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section6.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section6.p1")}</p>
                <p>(2) {t("termsOfService.section6.p2").split("info@medena.at")[0]}
                  <a href="mailto:info@medena.at" className="text-primary hover:underline">info@medena.at</a>
                  {t("termsOfService.section6.p2").split("info@medena.at")[1] || "."}
                </p>
                <p>(3) {t("termsOfService.section6.p3")}</p>
                <p>(4) {t("termsOfService.section6.p4")}</p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section7.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section7.p1").includes("Datenschutzerklärung") || t("termsOfService.section7.p1").includes("Privacy Policy") ? (
                  <>
                    {isEnglish ? "Our " : "Für die Verarbeitung personenbezogener Daten gilt unsere "}
                    <Link to="/datenschutz" className="text-primary hover:underline">
                      {isEnglish ? "Privacy Policy" : "Datenschutzerklärung"}
                    </Link>
                    {isEnglish ? " applies to the processing of personal data." : "."}
                  </>
                ) : t("termsOfService.section7.p1")}</p>
                <p>(2) {t("termsOfService.section7.p2")}</p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section8.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section8.p1")}</p>
                <p>(2) {t("termsOfService.section8.p2")}</p>
                <p>(3) {t("termsOfService.section8.p3")}</p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section9.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section9.p1")}</p>
                <p>(2) {t("termsOfService.section9.p2")}</p>
                <p>(3) {t("termsOfService.section9.p3")}</p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("termsOfService.section10.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <p>(1) {t("termsOfService.section10.p1")}</p>
                <p>(2) {t("termsOfService.section10.p2")}</p>
              </div>
            </section>

            {/* Date */}
            <p className="text-sm text-muted-foreground mt-12 pt-8 border-t border-border">
              {t("lastUpdated")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
