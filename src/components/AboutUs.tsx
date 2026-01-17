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
    <section id="about" className="section-padding gradient-warm">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-5">
              Über Telederm
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground mb-7">
              Wir revolutionieren die dermatologische Versorgung
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
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
            <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-border">
              <div>
                <div className="text-3xl lg:text-4xl font-serif font-bold text-primary">50k+</div>
                <div className="text-sm text-muted-foreground mt-1">Patienten</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-serif font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground mt-1">Dermatologen</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-serif font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground mt-1">Bewertung</div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-5">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-7 shadow-soft hover:shadow-card transition-all duration-400 border border-border/50"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 gradient-hero rounded-3xl p-10 md:p-14 text-center shadow-elevated">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-primary-foreground mb-5">
            Unsere Mission
          </h3>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            "Wir glauben, dass jeder Mensch Zugang zu erstklassiger dermatologischer 
            Versorgung verdient – schnell, einfach und von überall aus. Mit Telederm 
            machen wir diesen Traum zur Realität."
          </p>
          <p className="text-primary-foreground/70 mt-5 font-medium">— Das Telederm Team</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
