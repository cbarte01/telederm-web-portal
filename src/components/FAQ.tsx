import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"];

const FAQ = () => {
  const { t } = useTranslation("home");

  return (
    <section id="faq" className="section-padding">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="section-header">
            <span className="section-label">
              {t("faq.label")}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
              {t("faq.title")}
            </h2>
            <p className="text-lg text-muted-foreground font-light">
              {t("faq.description")}
            </p>
            <div className="section-divider" />
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqKeys.map((key, index) => (
              <AccordionItem
                key={key}
                value={`item-${index}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="text-left text-foreground font-semibold py-5 hover:text-primary transition-colors">
                  {t(`faq.questions.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {t(`faq.questions.${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
