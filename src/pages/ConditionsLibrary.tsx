import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search } from "lucide-react";
import {
  conditions,
  categoryLabels,
  categoryColors,
  type ConditionCategory,
} from "@/data/conditions";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ConditionsLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ConditionCategory | "all">("all");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const categories: (ConditionCategory | "all")[] = [
    "all",
    "skin",
    "hair",
    "nails",
    "infections",
    "allergies",
    "pigmentation",
  ];

  const filteredConditions = useMemo(() => {
    return conditions.filter((condition) => {
      const matchesSearch = condition.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || condition.category === activeCategory;
      const matchesLetter =
        !activeLetter || condition.name.toUpperCase().startsWith(activeLetter);
      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [searchQuery, activeCategory, activeLetter]);

  // Group conditions by first letter for display
  const groupedConditions = useMemo(() => {
    const grouped: Record<string, typeof conditions> = {};
    filteredConditions.forEach((condition) => {
      const letter = condition.name[0].toUpperCase();
      if (!grouped[letter]) {
        grouped[letter] = [];
      }
      grouped[letter].push(condition);
    });
    return grouped;
  }, [filteredConditions]);

  const availableLetters = useMemo(() => {
    return new Set(conditions.map((c) => c.name[0].toUpperCase()));
  }, []);

  const handleLetterClick = (letter: string) => {
    if (activeLetter === letter) {
      setActiveLetter(null);
    } else {
      setActiveLetter(letter);
      // Scroll to the letter section
      const element = document.getElementById(`letter-${letter}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveLetter(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-12 md:pb-16 bg-gradient-warm">
        <div className="container">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Conditions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Skin Conditions Library
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
            Explore our comprehensive guide to dermatological conditions. Find information about symptoms, causes, and available treatments.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border/60 shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-[72px] md:top-[88px] z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 py-4">
        <div className="container">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "gradient-hero text-primary-foreground"
                    : ""
                }
              >
                {category === "all" ? "All Conditions" : categoryLabels[category]}
              </Button>
            ))}
          </div>

          {/* A-Z Quick Jump */}
          <div className="flex flex-wrap gap-1">
            {alphabet.map((letter) => {
              const isAvailable = availableLetters.has(letter);
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && handleLetterClick(letter)}
                  disabled={!isAvailable}
                  className={`w-8 h-8 text-sm font-medium rounded transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isAvailable
                      ? "hover:bg-muted text-foreground"
                      : "text-muted-foreground/40 cursor-not-allowed"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
            {(activeLetter || activeCategory !== "all" || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-2 text-primary hover:text-primary"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          {filteredConditions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No conditions found matching your criteria.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.keys(groupedConditions)
                .sort()
                .map((letter) => (
                  <div key={letter} id={`letter-${letter}`}>
                    <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 pb-2 border-b border-border">
                      {letter}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedConditions[letter].map((condition) => (
                        <div
                          key={condition.name}
                          className="p-6 rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-card transition-all duration-300"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-serif font-semibold text-lg text-foreground">
                              {condition.name}
                            </h3>
                            <span
                              className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                                categoryColors[condition.category]
                              }`}
                            >
                              {categoryLabels[condition.category]}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {condition.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Results count */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">
              Showing {filteredConditions.length} of {conditions.length} conditions
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-warm">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl text-foreground mb-6">
            Need Expert Advice?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our board-certified dermatologists are ready to help diagnose and treat your skin condition. Get personalized care from the comfort of your home.
          </p>
          <Button variant="hero" size="lg" className="shadow-soft">
            Start Your Consultation
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConditionsLibrary;
