import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const featuredConditions = [
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
    <section id="conditions" className="section-padding">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
              What We Treat
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-7 text-balance">
              Expert Care for All Skin Conditions
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Our board-certified dermatologists specialize in diagnosing and treating a wide range of skin, hair, and nail conditions. Whether it's a minor concern or a chronic condition, we're here to help.
            </p>
            <Button variant="hero" size="lg" className="group shadow-soft" asChild>
              <Link to="/conditions">
                View All Conditions
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Right - Conditions Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {featuredConditions.map((condition) => (
              <div
                key={condition.name}
                className="p-6 rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-card transition-all duration-400 cursor-pointer group"
              >
                <h3 className="font-serif font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {condition.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
