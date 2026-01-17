import { Heart, Shield, Zap, Users } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Patientenzentriert",
    description: "Ihre Gesundheit steht bei uns an erster Stelle",
  },
  {
    icon: Shield,
    title: "Datenschutz",
    description: "Höchste Standards für Ihre persönlichen Daten",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Modernste Telemedizin-Technologie",
  },
  {
    icon: Users,
    title: "Zugänglichkeit",
    description: "Hautarzt für jeden, überall und jederzeit",
  },
];

const AboutUs = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-white to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Über Telederm
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Wir revolutionieren die dermatologische Versorgung
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Telederm wurde 2020 mit einer klaren Vision gegründet: Jedem Menschen 
                in Deutschland schnellen und einfachen Zugang zu qualifizierter 
                dermatologischer Versorgung zu ermöglichen.
              </p>
              <p>
                Lange Wartezeiten auf Hautarzttermine sind ein Problem, das wir lösen 
                wollten. Mit unserem Team aus erfahrenen Dermatologen und modernster 
                Telemedizin-Technologie bieten wir eine schnelle, sichere und 
                professionelle Alternative.
              </p>
              <p>
                Heute vertrauen uns über 50.000 Patienten ihre Hautgesundheit an. 
                Unser Ärzteteam besteht aus mehr als 20 approbierten Fachärzten für 
                Dermatologie, die mit Leidenschaft und Expertise für Sie da sind.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground">Patienten</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground">Dermatologen</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Bewertung</div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Unsere Mission
          </h3>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            "Wir glauben, dass jeder Mensch Zugang zu erstklassiger dermatologischer 
            Versorgung verdient – schnell, einfach und von überall aus. Mit Telederm 
            machen wir diesen Traum zur Realität."
          </p>
          <p className="text-white/70 mt-4">— Das Telederm Team</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
