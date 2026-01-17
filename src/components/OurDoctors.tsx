import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Award, GraduationCap, Languages } from "lucide-react";

const doctors = [
  {
    name: "Dr. med. Julia Schneider",
    title: "Fachärztin für Dermatologie",
    specialty: "Allgemeine Dermatologie, Allergologie",
    experience: "12 Jahre Erfahrung",
    languages: ["Deutsch", "Englisch"],
    education: "Charité Berlin",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. med. Markus Weber",
    title: "Facharzt für Dermatologie",
    specialty: "Akne, Psoriasis, Neurodermitis",
    experience: "15 Jahre Erfahrung",
    languages: ["Deutsch", "Englisch", "Französisch"],
    education: "LMU München",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. med. Sarah Hoffmann",
    title: "Fachärztin für Dermatologie",
    specialty: "Hautkrebs-Vorsorge, Muttermale",
    experience: "10 Jahre Erfahrung",
    languages: ["Deutsch", "Englisch"],
    education: "Universität Heidelberg",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. med. Thomas Müller",
    title: "Facharzt für Dermatologie",
    specialty: "Ekzeme, Pilzinfektionen",
    experience: "18 Jahre Erfahrung",
    languages: ["Deutsch"],
    education: "Universität Freiburg",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Dr. med. Anna Fischer",
    title: "Fachärztin für Dermatologie",
    specialty: "Kinder-Dermatologie, Allergien",
    experience: "8 Jahre Erfahrung",
    languages: ["Deutsch", "Englisch", "Spanisch"],
    education: "Universität Köln",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
  },
];

const OurDoctors = () => {
  return (
    <section id="doctors" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Unser Ärzteteam
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Erfahrene Dermatologen für Ihre Haut
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alle unsere Ärzte sind approbierte Fachärzte für Dermatologie mit 
            langjähriger Erfahrung in der Behandlung von Hauterkrankungen
          </p>
        </div>

        <div className="relative px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {doctors.map((doctor, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-secondary/30 rounded-2xl overflow-hidden h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-primary font-medium text-sm mb-3">
                        {doctor.title}
                      </p>
                      <p className="text-muted-foreground text-sm mb-4">
                        {doctor.specialty}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="w-4 h-4 text-primary" />
                          <span>{doctor.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span>{doctor.education}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Languages className="w-4 h-4 text-primary" />
                          <span>{doctor.languages.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 bg-white shadow-lg hover:bg-primary hover:text-white border-0" />
            <CarouselNext className="hidden md:flex -right-4 bg-white shadow-lg hover:bg-primary hover:text-white border-0" />
          </Carousel>
          
          {/* Mobile swipe indicator */}
          <p className="text-center text-sm text-muted-foreground mt-6 md:hidden">
            ← Wischen um mehr zu sehen →
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurDoctors;
