import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Users,
  TrendingUp,
  Shield,
  Euro,
  Clock,
  Building2,
  Headphones,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Stethoscope,
  Quote,
  MapPin,
  Star,
} from "lucide-react";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";

// Doctor images
import drMueller from "@/assets/doctors/dr-mueller.jpg";
import drWeber from "@/assets/doctors/dr-weber.jpg";
import drSchmidt from "@/assets/doctors/dr-schmidt.jpg";
import drBraun from "@/assets/doctors/dr-braun.jpg";

const ForDoctors = () => {
  const { t } = useTranslation("doctors");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const benefits = [
    {
      key: "income",
      icon: Euro,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      key: "flexibility",
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      key: "organization",
      icon: Building2,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      key: "support",
      icon: Headphones,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      key: "compliance",
      icon: Shield,
      gradient: "from-rose-500 to-pink-500",
    },
    {
      key: "training",
      icon: GraduationCap,
      gradient: "from-indigo-500 to-blue-500",
    },
  ];

  const steps = ["register", "training", "start"];

  const testimonials = [
    { key: "mueller", image: drMueller },
    { key: "weber", image: drWeber },
    { key: "schmidt", image: drSchmidt },
    { key: "braun", image: drBraun },
  ];

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const faqItems = [
    "requirements",
    "billing",
    "eprescription",
    "liability",
    "time",
    "platform",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-cover bg-center" />

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground">
                    {t("breadcrumb.home")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary-foreground/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary-foreground">
                  {t("breadcrumb.forDoctors")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Stethoscope className="w-4 h-4 mr-2" />
              {t("page.badge")}
            </Badge>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              {t("page.title")}
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
              {t("page.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                {t("cta.button")}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {t("cta.secondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-3xl font-bold text-foreground">{t("stats.doctors")}</p>
                    <p className="text-sm text-muted-foreground">{t("stats.doctorsLabel")}</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-3xl font-bold text-foreground">{t("stats.treatments")}</p>
                    <p className="text-sm text-muted-foreground">{t("stats.treatmentsLabel")}</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-3">
                  <Shield className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-3xl font-bold text-foreground">{t("stats.insurances")}</p>
                    <p className="text-sm text-muted-foreground">{t("stats.insurancesLabel")}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("benefits.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("benefits.description")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={benefit.key} delay={index * 100}>
                <div
                  className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t(`benefits.${benefit.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(`benefits.${benefit.key}.description`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Star className="w-3 h-3 mr-1 fill-primary" />
                Trusted by 750+ Doctors
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("testimonials.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("testimonials.description")}
              </p>
            </div>
          </ScrollReveal>

          {/* Carousel */}
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 disabled:opacity-50"
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 disabled:opacity-50"
              disabled={!canScrollNext}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel viewport */}
            <div className="overflow-hidden px-8 md:px-0" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.key}
                    className="flex-[0_0_100%] md:flex-[0_0_85%] min-w-0 pl-4 first:pl-0"
                  >
                    <div
                      className={`relative bg-card rounded-3xl p-8 md:p-10 border shadow-lg transition-all duration-500 ${
                        selectedIndex === index
                          ? "border-primary/30 scale-100 opacity-100"
                          : "border-border scale-95 opacity-60"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Doctor photo */}
                        <div className="relative flex-shrink-0">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">
                            <img
                              src={testimonial.image}
                              alt={t(`testimonials.items.${testimonial.key}.name`)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Quote badge */}
                          <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <Quote className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                          {/* Stars */}
                          <div className="flex gap-1 justify-center md:justify-start mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>

                          {/* Quote */}
                          <p className="text-foreground text-lg md:text-xl leading-relaxed mb-6 italic">
                            "{t(`testimonials.items.${testimonial.key}.quote`)}"
                          </p>

                          {/* Doctor info */}
                          <div>
                            <p className="font-semibold text-lg text-foreground">
                              {t(`testimonials.items.${testimonial.key}.name`)}
                            </p>
                            <p className="text-primary font-medium">
                              {t(`testimonials.items.${testimonial.key}.specialty`)}
                            </p>
                            <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                {t(`testimonials.items.${testimonial.key}.location`)}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {t(`testimonials.items.${testimonial.key}.experience`)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    selectedIndex === index
                      ? "bg-primary w-8"
                      : "bg-border hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("howItWorks.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("howItWorks.description")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <ScrollReveal key={step} delay={index * 150}>
                <div className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                  )}

                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                      <span className="text-5xl font-bold text-primary">{index + 1}</span>
                    </div>
                    <Badge variant="outline" className="mb-4">
                      {t(`howItWorks.steps.${step}.step`)}
                    </Badge>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {t(`howItWorks.steps.${step}.title`)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(`howItWorks.steps.${step}.description`)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t("faq.title")}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t("faq.description")}
                </p>
              </div>
            </ScrollReveal>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <ScrollReveal key={item} delay={index * 75}>
                  <AccordionItem
                    value={item}
                    className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                      {t(`faq.items.${item}.question`)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {t(`faq.items.${item}.answer`)}
                    </AccordionContent>
                  </AccordionItem>
                </ScrollReveal>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-lg">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-3">
                      {t("contact.success.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("contact.success.description")}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
                        {t("contact.title")}
                      </h2>
                      <p className="text-muted-foreground">
                        {t("contact.description")}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("contact.form.firstName")}
                          </label>
                          <Input
                            type="text"
                            placeholder={t("contact.form.firstNamePlaceholder")}
                            required
                            className="h-12"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("contact.form.lastName")}
                          </label>
                          <Input
                            type="text"
                            placeholder={t("contact.form.lastNamePlaceholder")}
                            required
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("contact.form.email")}
                        </label>
                        <Input
                          type="email"
                          placeholder={t("contact.form.emailPlaceholder")}
                          required
                          className="h-12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("contact.form.phone")}
                        </label>
                        <Input
                          type="tel"
                          placeholder={t("contact.form.phonePlaceholder")}
                          className="h-12"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-base"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 gradient-hero">
        <div className="container">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                {t("cta.title")}
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-10">
                {t("cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  {t("cta.button")}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {t("cta.secondary")}
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForDoctors;
