import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, Languages } from "lucide-react";
import drNarroBartenstein from "@/assets/doctors/dr-narro-bartenstein.jpg";
import drAmbrosRudolph from "@/assets/doctors/dr-ambros-rudolph.jpg";

const OurDoctors = () => {
  const { t, i18n } = useTranslation("home");
  const isEnglish = i18n.language === 'en';

  const doctors = [
    {
      key: "d1",
      languages: isEnglish ? ["German", "English"] : ["Deutsch", "Englisch"],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      website: "https://www.charite.de",
    },
    {
      key: "d2",
      languages: isEnglish ? ["German", "English", "French"] : ["Deutsch", "Englisch", "Französisch"],
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      website: "https://www.lmu-klinikum.de",
    },
    {
      key: "d3",
      languages: isEnglish ? ["German", "English"] : ["Deutsch", "Englisch"],
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
      website: "https://www.klinikum.uni-heidelberg.de",
    },
    {
      key: "d4",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
      website: "https://www.uniklinik-freiburg.de",
    },
    {
      key: "d5",
      languages: isEnglish ? ["German", "English", "Spanish"] : ["Deutsch", "Englisch", "Spanisch"],
      image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face",
      website: "https://www.uk-koeln.de",
    },
    {
      key: "d6",
      languages: isEnglish ? ["German", "English"] : ["Deutsch", "Englisch"],
      image: drNarroBartenstein,
      website: "https://dr-narro-bartenstein.com/",
    },
    {
      key: "d7",
      languages: isEnglish ? ["German", "English"] : ["Deutsch", "Englisch"],
      image: drAmbrosRudolph,
      website: "https://ambros-rudolph.at/",
    },
  ];

  return (
    <section id="doctors" className="section-padding bg-card">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <span className="section-label">
            {t("doctors.label")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            {t("doctors.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            {t("doctors.description")}
          </p>
          <div className="section-divider" />
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
                  <div className="bg-secondary/30 rounded-2xl overflow-hidden h-full shadow-soft hover:shadow-card transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={doctor.image}
                        alt={t(`doctors.doctors.${doctor.key}.name`)}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-7">
                      <h3 className="text-2xl text-foreground mb-2">
                        <a 
                          href={doctor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors underline-offset-2 hover:underline"
                        >
                          {t(`doctors.doctors.${doctor.key}.name`)}
                        </a>
                      </h3>
                      <p className="text-primary font-medium text-sm mb-4">
                        {t(`doctors.doctors.${doctor.key}.title`)}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{t(`doctors.doctors.${doctor.key}.location`)}</span>
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