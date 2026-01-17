import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const categoryKeys = ["all", "skinCare", "conditions", "treatments", "lifestyle"];
const categoryIds = ["all", "skin-care", "conditions", "treatments", "lifestyle"];

const blogPostConfigs = [
  { key: "post1", categoryId: "conditions", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop" },
  { key: "post2", categoryId: "treatments", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop" },
  { key: "post3", categoryId: "skin-care", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop" },
  { key: "post4", categoryId: "conditions", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop" },
  { key: "post5", categoryId: "lifestyle", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop" },
  { key: "post6", categoryId: "treatments", image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=400&fit=crop" },
  { key: "post7", categoryId: "skin-care", image: "https://images.unsplash.com/photo-1526758097130-bab247274f58?w=600&h=400&fit=crop" },
  { key: "post8", categoryId: "lifestyle", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop" },
  { key: "post9", categoryId: "conditions", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop" },
];

const SkinBlog = () => {
  const { t } = useTranslation("blog");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = activeCategory === "all" 
    ? blogPostConfigs 
    : blogPostConfigs.filter(post => post.categoryId === activeCategory);

  const getCategoryLabel = (categoryId: string) => {
    const index = categoryIds.indexOf(categoryId);
    if (index >= 0) {
      return t(`categories.${categoryKeys[index]}`);
    }
    return categoryId;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-accent to-background">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">
              {t("breadcrumb.home", "Home")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{t("page.title")}</span>
          </nav>
          
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              {t("page.badge")}
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              {t("page.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("page.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            {categoryKeys.map((key, index) => (
              <button
                key={key}
                onClick={() => setActiveCategory(categoryIds[index])}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === categoryIds[index]
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {t(`categories.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.key}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50"
              >
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={post.image}
                    alt={t(`posts.${post.key}.title`)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-card/90 text-foreground backdrop-blur-sm border-0">
                      {getCategoryLabel(post.categoryId)}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span>{t(`posts.${post.key}.date`, "")}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>{t(`posts.${post.key}.readTime`, "5 min")}</span>
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {t(`posts.${post.key}.title`)}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                    {t(`posts.${post.key}.excerpt`)}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary font-medium group/btn">
                    {t("readArticle", "Read Article")}
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              {t("loadMore", "Load More Articles")}
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-accent to-secondary/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("newsletter.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("newsletter.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="flex-1 px-5 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Button variant="hero" size="lg">
                {t("newsletter.subscribe", "Subscribe")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {t("newsletter.noSpam")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SkinBlog;
