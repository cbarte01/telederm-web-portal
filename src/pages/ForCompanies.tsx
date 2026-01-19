import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  TrendingUp,
  Building2,
  PiggyBank,
  Settings,
  BarChart3,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  Quote,
  Star,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Shield,
} from "lucide-react";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";

import heroSkin from "@/assets/hero-skin.jpg";

const ForCompanies = () => {
  const { t } = useTranslation("companies");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const benefits = [
    { key: "health", icon: Heart, bgClass: "bg-gradient-to-br from-rose-500 to-pink-600" },
    { key: "productivity", icon: TrendingUp, bgClass: "bg-gradient-to-br from-emerald-500 to-teal-600" },
    { key: "employer", icon: Building2, bgClass: "bg-gradient-to-br from-primary to-primary/80" },
    { key: "costs", icon: PiggyBank, bgClass: "bg-gradient-to-br from-amber-500 to-orange-600" },
    { key: "simple", icon: Settings, bgClass: "bg-gradient-to-br from-slate-600 to-slate-700" },
    { key: "data", icon: BarChart3, bgClass: "bg-gradient-to-br from-violet-500 to-indigo-600" },
  ];

  const steps = [
    { key: "step1", icon: Calendar },
    { key: "step2", icon: Users },
    { key: "step3", icon: CheckCircle2 },
  ];

  const testimonials = [
    { key: "t1" },
    { key: "t2" },
    { key: "t3" },
  ];

  const faqItems = ["q1", "q2", "q3", "q4", "q5", "q6"];

  return (
    <div className="min-h-screen bg-background companies-theme">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <img
            src={heroSkin}
            alt="Corporate health management"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 py-32 md:py-40">
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
                  {t("breadcrumb.forCompanies")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="max-w-xl">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                <Briefcase className="w-4 h-4 mr-2" />
                {t("page.badge")}
              </Badge>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                {t("page.title")}
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
                {t("page.description")}
              </p>

              {/* Key benefits list */}
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                  <span>{t("page.heroBenefits.reducedAbsence")}</span>
                </li>
                <li className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                  <span>{t("page.heroBenefits.employeeSatisfaction")}</span>
                </li>
                <li className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                  <span>{t("page.heroBenefits.noWaiting")}</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="xl"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t("packages.cta")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right side - Stats card */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl p-8 border border-border shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Vorteile auf einen Blick</h3>
                  <p className="text-muted-foreground">Warum Unternehmen Telederm wählen</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{t("stats.savings")}</p>
                      <p className="text-muted-foreground text-sm">{t("stats.savingsLabel")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{t("stats.employees")}</p>
                      <p className="text-muted-foreground text-sm">{t("stats.employeesLabel")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{t("stats.satisfaction")}</p>
                      <p className="text-muted-foreground text-sm">{t("stats.satisfactionLabel")}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-lg font-semibold"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t("packages.cta")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-28 bg-background">
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
                <div className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full">
                  <div
                    className={`w-14 h-14 rounded-xl ${benefit.bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}
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
              <ScrollReveal key={step.key} delay={index * 150}>
                <div className="relative text-center">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                  )}
                  
                  {/* Step number */}
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 mb-6">
                    <span className="text-4xl font-bold text-primary">{index + 1}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t(`howItWorks.steps.${step.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(`howItWorks.steps.${step.key}.description`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 md:py-28 bg-background">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("packages.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("packages.description")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Package */}
            <ScrollReveal delay={0}>
              <div className="relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {t("packages.basic.name")}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t("packages.basic.description")}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{t("packages.basic.price")}</span>
                    <span className="text-muted-foreground">{t("packages.perEmployee")}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {(t("packages.basic.features", { returnObjects: true }) as string[]).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t("packages.cta")}
                </Button>
              </div>
            </ScrollReveal>

            {/* Professional Package - Featured */}
            <ScrollReveal delay={100}>
              <div className="relative bg-card rounded-2xl p-8 border-2 border-primary shadow-xl h-full flex flex-col">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Beliebteste Wahl
                </Badge>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {t("packages.professional.name")}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t("packages.professional.description")}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{t("packages.professional.price")}</span>
                    <span className="text-muted-foreground">{t("packages.perEmployee")}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {(t("packages.professional.features", { returnObjects: true }) as string[]).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t("packages.cta")}
                </Button>
              </div>
            </ScrollReveal>

            {/* Enterprise Package */}
            <ScrollReveal delay={200}>
              <div className="relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {t("packages.enterprise.name")}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t("packages.enterprise.description")}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{t("packages.enterprise.price")}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {(t("packages.enterprise.features", { returnObjects: true }) as string[]).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t("packages.cta")}
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Star className="w-3 h-3 mr-1 fill-primary" />
                Kundenstimmen
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("testimonials.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("testimonials.description")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={testimonial.key} delay={index * 100}>
                <div className="bg-card rounded-2xl p-8 border border-border h-full flex flex-col">
                  <Quote className="w-10 h-10 text-primary/30 mb-4" />
                  <p className="text-foreground mb-6 flex-1 italic">
                    "{t(`testimonials.items.${testimonial.key}.quote`)}"
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">
                      {t(`testimonials.items.${testimonial.key}.name`)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`testimonials.items.${testimonial.key}.role`)}
                    </p>
                    <p className="text-sm text-primary">
                      {t(`testimonials.items.${testimonial.key}.company`)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-28 bg-background">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("faq.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("faq.description")}
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <ScrollReveal key={item} delay={index * 50}>
                  <AccordionItem
                    value={item}
                    className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                      {t(`faq.questions.${item}.question`)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {t(`faq.questions.${item}.answer`)}
                    </AccordionContent>
                  </AccordionItem>
                </ScrollReveal>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutUs />

      {/* Contact Form Section */}
      <section id="contact" className="py-20 md:py-28 gradient-hero">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-border">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
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

                    {/* Benefits badges */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Phone className="w-3 h-3 mr-1" />
                        {t("contact.benefits.callback")}
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Calendar className="w-3 h-3 mr-1" />
                        {t("contact.benefits.demo")}
                      </Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Shield className="w-3 h-3 mr-1" />
                        {t("contact.benefits.noObligation")}
                      </Badge>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="company">{t("contact.form.company")}</Label>
                          <Input
                            id="company"
                            placeholder={t("contact.form.companyPlaceholder")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("contact.form.name")}</Label>
                          <Input
                            id="name"
                            placeholder={t("contact.form.namePlaceholder")}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("contact.form.email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("contact.form.emailPlaceholder")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder={t("contact.form.phonePlaceholder")}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employees">{t("contact.form.employees")}</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t("contact.form.employeesPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">{t("contact.form.employeesOptions.small")}</SelectItem>
                            <SelectItem value="medium">{t("contact.form.employeesOptions.medium")}</SelectItem>
                            <SelectItem value="large">{t("contact.form.employeesOptions.large")}</SelectItem>
                            <SelectItem value="enterprise">{t("contact.form.employeesOptions.enterprise")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t("contact.form.message")}</Label>
                        <Textarea
                          id="message"
                          placeholder={t("contact.form.messagePlaceholder")}
                          rows={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-14 text-lg font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? t("contact.form.sending") : t("contact.form.submit")}
                        {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForCompanies;
