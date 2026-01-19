import { Star, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviewKeys = [
  "r1", "r2", "r3", "r4", "r5", "r6",
  "r7", "r8", "r9", "r10", "r11", "r12",
  "r13", "r14", "r15", "r16", "r17", "r18"
];

const avatars = [
  "S", "T", "L", "M", "A", "D",
  "K", "J", "P", "C", "N", "H",
  "E", "F", "R", "B", "V", "G"
];

const ratings = [
  5, 5, 5, 4, 5, 5,
  5, 4, 5, 5, 5, 4,
  5, 5, 4, 5, 5, 5
];

const Reviews = () => {
  const { t } = useTranslation("home");

  return (
    <section id="reviews" className="section-padding bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <div className="inline-flex items-center gap-2.5 bg-white rounded-full px-5 py-2.5 shadow-soft mb-6">
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-5 h-5"
            />
            <span className="font-medium text-foreground">Google Reviews</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-muted-foreground text-sm font-light">4.9/5</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            {t("reviews.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            {t("reviews.description")}
          </p>
          <div className="section-divider" />
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            duration: 30,
          }}
          plugins={[
            Autoplay({
              delay: 2500,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {reviewKeys.map((key, index) => (
              <CarouselItem key={key} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-2xl p-7 shadow-soft hover:shadow-card transition-shadow duration-300 h-full border border-border/30">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center text-primary font-medium text-lg flex-shrink-0">
                      {avatars[index]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-foreground truncate">
                          {t(`reviews.reviews.${key}.name`)}
                        </h4>
                        <span className="text-sm text-muted-foreground whitespace-nowrap font-light">
                          {t(`reviews.reviews.${key}.date`)}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < ratings[index]
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-1 w-6 h-6 text-primary/15" />
                    <p className="text-muted-foreground pl-5 font-light leading-relaxed">
                      {t(`reviews.reviews.${key}.text`)}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>

        <div className="text-center mt-10">
          <a
            href="https://google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {t("reviews.viewAll")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
