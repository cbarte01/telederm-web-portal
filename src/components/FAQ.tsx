import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the online consultation work?",
    answer: "It's simple! Upload photos of your skin concern, answer a few questions about your symptoms and medical history, and our dermatologists will review your case. You'll receive a detailed diagnosis and treatment plan within 24 hours via the app.",
  },
  {
    question: "Who are the dermatologists?",
    answer: "All our dermatologists are board-certified specialists with years of clinical experience. They are licensed physicians who have completed specialized training in dermatology and are authorized to diagnose and prescribe treatments.",
  },
  {
    question: "Can you prescribe medication?",
    answer: "Yes, if our dermatologists determine that prescription medication is necessary for your treatment, they can issue a prescription. This will be sent directly to your preferred pharmacy for pickup or delivery.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We take your privacy seriously. All data is encrypted and stored in compliance with GDPR and medical data protection regulations. Your information is only accessible to the treating dermatologist and is never shared with third parties.",
  },
  {
    question: "What conditions can be treated online?",
    answer: "We treat a wide range of skin conditions including acne, eczema, psoriasis, rosacea, rashes, fungal infections, hair loss, and more. For conditions that require physical examination or procedures, we'll recommend an in-person visit.",
  },
  {
    question: "How long does it take to get a response?",
    answer: "Most cases receive a diagnosis within 24 hours during weekdays. Urgent cases may be prioritized. You'll receive a notification as soon as your dermatologist has reviewed your case.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 block">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our telemedicine service.
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="text-left text-foreground font-semibold py-5 hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
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
