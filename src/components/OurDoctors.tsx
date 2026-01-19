import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Award, GraduationCap, Languages } from "lucide-react";

const OurDoctors = () => {
  const { t, i18n } = useTranslation("home");
  const isEnglish = i18n.language === 'en';

  const doctors = [
    {
      key: "d1",
      experience: 12,
      languages: isEnglish ? ["German", "English"] : ["Deutsch", "Englisch"],
      education: "Charité Berlin",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      website: "https://www.charite.de",
    },
    {
      key: "d2",
      experience: 15,
      languages: isEnglish ? ["German", "English", "French"] : ["Deutsch", "Englisch", "Französisch"],
      education: "LMU München",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      website: "https://www.lmu-klinikum.de",
    },
    {
      key: "d3",
      experience: 10,
      languages: isEnglish ? ["German", "English"] : ["Deutsch", "Englisch"],
      education: "Universität Heidelberg",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
      website: "https://www.klinikum.uni-heidelberg.de",
    },
    {
      key: "d4",
      experience: 18,
      languages: isEnglish ? ["German"] : ["Deutsch"],
      education: "Universität Freiburg",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
      website: "https://www.uniklinik-freiburg.de",
    },
    {
      key: "d5",
      experience: 8,
      languages: isEnglish ? ["German", "English", "Spanish"] : ["Deutsch", "Englisch", "Spanisch"],
      education: "Universität Köln",
      image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
      website: "https://www.uk-koeln.de",
    },
  ];

  return (
    <section id="doctors" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {t("doctors.label")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("doctors.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("doctors.description")}
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
                        alt={t(`doctors.doctors.${doctor.key}.name`)}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        <a 
                          href={doctor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors underline-offset-2 hover:underline"
                        >
                          {t(`doctors.doctors.${doctor.key}.name`)}
                        </a>
                      </h3>
                      <p className="text-primary font-medium text-sm mb-3">
                        {t(`doctors.doctors.${doctor.key}.title`)}
                      </p>
                      <p className="text-muted-foreground text-sm mb-4">
                        {t(`doctors.doctors.${doctor.key}.specialty`)}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Award className="w-4 h-4 text-primary" />
                          <span>{doctor.experience} {t("doctors.experience")}</span>
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
            {t("doctors.swipeHint")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurDoctors;