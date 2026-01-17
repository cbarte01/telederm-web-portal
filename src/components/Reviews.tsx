import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    rating: 5,
    date: "vor 2 Wochen",
    text: "Schnelle und professionelle Diagnose! Innerhalb von wenigen Stunden hatte ich eine Antwort und das richtige Medikament. Sehr empfehlenswert!",
    avatar: "S",
  },
  {
    name: "Thomas K.",
    rating: 5,
    date: "vor 1 Monat",
    text: "Endlich keine langen Wartezeiten mehr beim Hautarzt. Die App ist super einfach zu bedienen und die Ärzte sind sehr kompetent.",
    avatar: "T",
  },
  {
    name: "Lisa B.",
    rating: 5,
    date: "vor 3 Wochen",
    text: "Hatte ein hartnäckiges Ekzem und bekam sofort die richtige Behandlung. Nach einer Woche war alles weg. Danke Telederm!",
    avatar: "L",
  },
  {
    name: "Michael R.",
    rating: 4,
    date: "vor 2 Monaten",
    text: "Sehr guter Service. Die Fotos hochladen war einfach und die Diagnose kam schneller als erwartet. Würde es wieder nutzen.",
    avatar: "M",
  },
  {
    name: "Anna S.",
    rating: 5,
    date: "vor 1 Woche",
    text: "Perfekt für Berufstätige! Konnte alles von zuhause aus erledigen, ohne mir einen Tag frei nehmen zu müssen.",
    avatar: "A",
  },
  {
    name: "David W.",
    rating: 5,
    date: "vor 3 Tagen",
    text: "Die Dermatologen sind wirklich Experten auf ihrem Gebiet. Habe mich gut aufgehoben gefühlt und die Behandlung hat sofort gewirkt.",
    avatar: "D",
  },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-4">
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-5 h-5"
            />
            <span className="font-semibold text-foreground">Google Reviews</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">4.9/5</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Das sagen unsere Patienten
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Über 10.000 zufriedene Patienten vertrauen Telederm für ihre Hautgesundheit
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{review.name}</h4>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-2 -left-1 w-6 h-6 text-primary/20" />
                <p className="text-muted-foreground pl-4">{review.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Alle Bewertungen auf Google ansehen
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
