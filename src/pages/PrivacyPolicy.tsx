import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PrivacyPolicy = () => {
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
            <span className="text-foreground">{t("privacyPolicy.breadcrumb")}</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {t("privacyPolicy.title")}
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

            {/* Introduction */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              {t("privacyPolicy.intro")}
            </p>

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section1.title")}
              </h2>
              <address className="not-italic text-muted-foreground leading-relaxed whitespace-pre-line">
                Medena Care GmbH{"\n"}
                Testgasse 1{"\n"}
                1010 {isEnglish ? "Vienna" : "Wien"}{"\n"}
                {isEnglish ? "Austria" : "Österreich"}{"\n"}
                E-Mail: <a href="mailto:info@medena.at" className="text-primary hover:underline">info@medena.at</a>
              </address>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section2.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section2.content")}
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section3.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section3.content")}
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section4.title")}
              </h2>

              <div className="ml-4 space-y-8">
                {/* 4.1 */}
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("privacyPolicy.section4.subsection1.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    {t("privacyPolicy.section4.subsection1.content")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>{t("privacyPolicy.section4.subsection1.legalBasis")}</strong>
                  </p>
                </div>

                {/* 4.2 */}
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("privacyPolicy.section4.subsection2.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    {t("privacyPolicy.section4.subsection2.content")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>{t("privacyPolicy.section4.subsection2.legalBasis")}</strong>
                  </p>
                </div>

                {/* 4.3 */}
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground mb-3">
                    {t("privacyPolicy.section4.subsection3.title")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {t("privacyPolicy.section4.subsection3.content")}
                  </p>
                  <div className="text-muted-foreground leading-relaxed mb-2">
                    <strong>{t("privacyPolicy.section4.subsection3.legalBasisTitle")}</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>{t("privacyPolicy.section4.subsection3.legalBasis1")}</li>
                      <li>{t("privacyPolicy.section4.subsection3.legalBasis2")}</li>
                      <li>{t("privacyPolicy.section4.subsection3.legalBasis3")}</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>{t("privacyPolicy.section4.subsection3.retention")}</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section5.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section5.content")}
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section6.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section6.content")}
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section7.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section7.content")}
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section8.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                {t("privacyPolicy.section8.content")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>{t("privacyPolicy.section8.legalBasis")}</strong>
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section9.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                {t("privacyPolicy.section9.content")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>{t("privacyPolicy.section9.legalBasis")}</strong>
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section10.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section10.content")}
              </p>
            </section>

            {/* Section 11 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section11.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section11.content")}
              </p>
            </section>

            {/* Section 12 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section12.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section12.content")}
              </p>
            </section>

            {/* Section 13 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section13.title")}
              </h2>
              <address className="not-italic text-muted-foreground leading-relaxed whitespace-pre-line">
                {isEnglish ? "Austrian Data Protection Authority" : "Österreichische Datenschutzbehörde"}{"\n"}
                Barichgasse 40–42{"\n"}
                1030 {isEnglish ? "Vienna" : "Wien"}{"\n"}
                <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  www.dsb.gv.at
                </a>
              </address>
            </section>

            {/* Section 14 */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t("privacyPolicy.section14.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyPolicy.section14.content")}
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

export default PrivacyPolicy;
