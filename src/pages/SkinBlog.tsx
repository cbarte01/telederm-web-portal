import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const categories = [
  { id: "all", label: "All Topics" },
  { id: "skin-care", label: "Skin Care" },
  { id: "conditions", label: "Conditions" },
  { id: "treatments", label: "Treatments" },
  { id: "lifestyle", label: "Lifestyle" },
];

const blogPosts = [
  {
    id: 1,
    title: "ABCDE Rule: How to Check Your Moles for Skin Cancer",
    excerpt: "Learn the simple ABCDE method dermatologists use to identify potentially dangerous moles and when to seek professional help.",
    category: "conditions",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    date: "January 15, 2026",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Understanding Acne: Causes, Types, and Effective Treatments",
    excerpt: "From hormonal acne to cystic breakouts, discover what causes different types of acne and the most effective treatment options available.",
    category: "treatments",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop",
    date: "January 12, 2026",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "The Ultimate Guide to Building a Skincare Routine",
    excerpt: "Step-by-step guidance on creating a personalized skincare routine that addresses your unique skin concerns and goals.",
    category: "skin-care",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop",
    date: "January 10, 2026",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Eczema Management: Tips for Living with Atopic Dermatitis",
    excerpt: "Practical advice for managing eczema flare-ups, including trigger identification, moisturizing strategies, and treatment options.",
    category: "conditions",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    date: "January 8, 2026",
    readTime: "8 min read",
  },
  {
    id: 5,
    title: "How Diet Affects Your Skin: Foods That Help and Harm",
    excerpt: "Explore the connection between nutrition and skin health, plus discover which foods can improve or worsen common skin conditions.",
    category: "lifestyle",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
    date: "January 5, 2026",
    readTime: "6 min read",
  },
  {
    id: 6,
    title: "Psoriasis Treatment Options: From Topicals to Biologics",
    excerpt: "A comprehensive overview of psoriasis treatments, including the latest advances in biologic therapies and lifestyle modifications.",
    category: "treatments",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=400&fit=crop",
    date: "January 3, 2026",
    readTime: "9 min read",
  },
  {
    id: 7,
    title: "Sun Protection 101: SPF, UVA, UVB Explained",
    excerpt: "Everything you need to know about protecting your skin from sun damage, including how to choose and apply sunscreen correctly.",
    category: "skin-care",
    image: "https://images.unsplash.com/photo-1526758097130-bab247274f58?w=600&h=400&fit=crop",
    date: "December 28, 2025",
    readTime: "5 min read",
  },
  {
    id: 8,
    title: "Stress and Skin: How Mental Health Impacts Your Complexion",
    excerpt: "Understand the science behind stress-related skin issues and learn strategies to maintain healthy skin during challenging times.",
    category: "lifestyle",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    date: "December 25, 2025",
    readTime: "6 min read",
  },
  {
    id: 9,
    title: "Rosacea: Triggers, Symptoms, and Treatment Approaches",
    excerpt: "Learn to identify rosacea triggers and discover effective treatment strategies to manage this common but often misunderstood condition.",
    category: "conditions",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop",
    date: "December 22, 2025",
    readTime: "7 min read",
  },
];

const SkinBlog = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts = activeCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const getCategoryLabel = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.label || categoryId;
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
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Skin Blog</span>
          </nav>
          
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Skin Health Resources
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Skin Blog
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Expert insights, treatment guides, and skincare tips from our board-certified dermatologists. 
              Stay informed about your skin health.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {category.label}
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
                key={post.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50"
              >
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-card/90 text-foreground backdrop-blur-sm border-0">
                      {getCategoryLabel(post.category)}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                    {post.excerpt}
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary font-medium group/btn">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-accent to-secondary/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Skin Health Tips in Your Inbox
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter and receive 20% off your first consultation, plus weekly skincare insights from our dermatologists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Button variant="hero" size="lg">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SkinBlog;
