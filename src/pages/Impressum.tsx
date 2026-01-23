import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Impressum = () => {
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
            <span className="text-foreground">{t("impressum.breadcrumb")}</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {t("impressum.title")}
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

            {/* Section 1: Company Information */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section1.title")}
              </h2>
              <address className="not-italic text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{t("impressum.section1.companyName")}</strong><br />
                Testgasse 1<br />
                1010 {isEnglish ? "Vienna" : "Wien"}<br />
                {isEnglish ? "Austria" : "Österreich"}
              </address>
            </section>

            {/* Section 2: Contact */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section2.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-1">
                <p>
                  {t("impressum.section2.email")} <a href="mailto:info@telederm.at" className="text-primary hover:underline">info@telederm.at</a>
                </p>
              </div>
            </section>

            {/* Section 3: Company Registration */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section3.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-1">
                <p><strong>{t("impressum.section3.registerNumber")}</strong> {t("impressum.section3.registerNumberValue")}</p>
                <p><strong>{t("impressum.section3.court")}</strong> {t("impressum.section3.courtValue")}</p>
                <p><strong>{t("impressum.section3.vatId")}</strong> {t("impressum.section3.vatIdValue")}</p>
              </div>
            </section>

            {/* Section 4: Management */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section4.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("impressum.section4.content")}
              </p>
            </section>

            {/* Section 5: Regulatory Authority */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section5.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("impressum.section5.content")}
              </p>
            </section>

            {/* Section 6: Business Purpose */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section6.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("impressum.section6.content")}
              </p>
            </section>

            {/* Section 7: Professional Regulations */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section7.title")}
              </h2>
              <div className="text-muted-foreground leading-relaxed">
                <p className="mb-2">{t("impressum.section7.intro")}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t("impressum.section7.regulation1")}</li>
                  <li>{t("impressum.section7.regulation2")}</li>
                  <li>{t("impressum.section7.regulation3")}</li>
                  <li>{t("impressum.section7.regulation4")}</li>
                </ul>
              </div>
            </section>

            {/* Section 8: Liability Disclaimer */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section8.title")}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("impressum.section8.content.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("impressum.section8.content.text")}
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("impressum.section8.links.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("impressum.section8.links.text")}
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("impressum.section8.medical.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("impressum.section8.medical.text")}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9: Copyright */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section9.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("impressum.section9.content")}
              </p>
            </section>

            {/* Section 10: Dispute Resolution */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("impressum.section10.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("impressum.section10.intro")}
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
                {t("impressum.section10.conclusion")}
              </p>
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

export default Impressum;
