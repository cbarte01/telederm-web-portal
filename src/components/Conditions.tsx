import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const conditions = [
  {
    name: "Acne",
    description: "Pimples, blackheads, and cysts affecting face and body",
  },
  {
    name: "Eczema",
    description: "Itchy, inflamed patches that can appear anywhere",
  },
  {
    name: "Psoriasis",
    description: "Red, scaly patches often on elbows, knees, and scalp",
  },
  {
    name: "Rosacea",
    description: "Facial redness and visible blood vessels",
  },
  {
    name: "Skin Rashes",
    description: "Unexplained irritation, redness, or allergic reactions",
  },
  {
    name: "Hair Loss",
    description: "Thinning hair or bald patches on scalp",
  },
];

const Conditions = () => {
  return (
    <section id="conditions" className="py-20 md:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 block">
              What We Treat
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Expert Care for All Skin Conditions
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our board-certified dermatologists specialize in diagnosing and treating a wide range of skin, hair, and nail conditions. Whether it's a minor concern or a chronic condition, we're here to help.
            </p>
            <Button variant="hero" size="lg" className="group">
              View All Conditions
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right - Conditions Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {conditions.map((condition) => (
              <div
                key={condition.name}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 cursor-pointer group"
              >
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {condition.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {condition.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Conditions;
