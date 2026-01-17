import { Camera, FileText, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Upload Photos",
    description: "Take clear photos of the affected skin area and describe your symptoms using our guided questionnaire.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Expert Review",
    description: "Our certified dermatologists carefully analyze your case and create a personalized diagnosis within 24 hours.",
  },
  {
    icon: Stethoscope,
    step: "03",
    title: "Get Treatment",
    description: "Receive your diagnosis with a detailed treatment plan. Prescriptions are sent directly to your pharmacy if needed.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 text-balance">
            Professional Care in 3 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Skip the waiting room and get expert skin care from the comfort of your home.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-14">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative group"
            >
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-border" />
              )}

              <div className="relative bg-card rounded-2xl p-8 lg:p-10 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 border border-border/50">
                {/* Step number */}
                <span className="absolute -top-4 -right-2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {item.step}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-7 shadow-sm">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
