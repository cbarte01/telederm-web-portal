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
import drArzberger from "@/assets/doctors/dr-arzberger.jpg";
import drBerger from "@/assets/doctors/dr-berger.jpg";
import drFruehauf from "@/assets/doctors/dr-fruehauf.jpg";
import drKilbertus from "@/assets/doctors/dr-kilbertus.png";
import drKraus from "@/assets/doctors/dr-kraus.jpg";
import drLeinweber from "@/assets/doctors/dr-leinweber.jpg";
import drMayr from "@/assets/doctors/dr-mayr.jpg";
import drMesseritschFanta from "@/assets/doctors/dr-messeritsch-fanta.jpg";
import profHofmannWellenhof from "@/assets/doctors/prof-hofmann-wellenhof.jpg";

const OurDoctors = () => {
  const { t, i18n } = useTranslation("home");
  const isEnglish = i18n.language === 'en';

  const doctors = [
    {
      key: "arzberger",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: drArzberger,
      website: "https://hautaerztin-arzberger.at",
    },
    {
      key: "berger",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: drBerger,
      website: "https://www.hautarzt-stadlpaura.at",
    },
    {
      key: "fruehauf",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: drFruehauf,
      website: "https://jf-hautarztpraxis.at",
    },
    {
      key: "kilbertus",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: drKilbertus,
      website: "https://dermatologie-kilbertus.at",
    },
    {
      key: "kraus",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: drKraus,
      website: "https://hautarzt-kraus.at",
    },
    {
      key: "leinweber",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: drLeinweber,
      website: "https://dr-leinweber.at",
    },
    {
      key: "mayr",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: drMayr,
      website: "https://hautaerztin-mayr.at",
    },
    {
      key: "messeritschfanta",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: drMesseritschFanta,
      website: "https://hautarztmoedling.at",
    },
    {
      key: "hofmannwellenhof",
      languages: isEnglish ? ["German"] : ["Deutsch"],
      image: profHofmannWellenhof,
      website: "https://online.medunigraz.at/mug_online/visitenkarte.show_vcard?pPersonenId=EF7DA1776081BDDB&pPersonenGruppe=3",
    },
    {
      key: "narrobartenstein",
      languages: isEnglish ? ["German", "English"] : ["Deutsch", "Englisch"],
      image: drNarroBartenstein,
      website: "https://dr-narro-bartenstein.com/",
    },
    {
      key: "ambrosrudolph",
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
                    <div className="aspect-square overflow-hidden bg-secondary/50 flex items-center justify-center">
                      <img
                        src={doctor.image}
                        alt={t(`doctors.doctors.${doctor.key}.name`)}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
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
