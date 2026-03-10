import { useState } from "react";
import { Plus, Trash2, Save, ChevronDown, ChevronUp, MessageSquareText, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import medenaLogo from "@/assets/logo/medena-logo.png";

interface Snippet {
  id: string;
  text: string;
}

interface SnippetCategory {
  id: string;
  label: string;
  snippets: Snippet[];
  isExpanded: boolean;
}

const DEFAULT_CATEGORIES: SnippetCategory[] = [
  {
    id: "1",
    label: "General Assessment",
    isExpanded: true,
    snippets: [
      { id: "1a", text: "Based on the submitted images and clinical history, the findings are consistent with" },
      { id: "1b", text: "The lesion appears benign and no immediate intervention is required." },
      { id: "1c", text: "Clinical correlation is recommended. A follow-up in 4–6 weeks is advised." },
    ],
  },
  {
    id: "2",
    label: "Treatment Recommendations",
    isExpanded: false,
    snippets: [
      { id: "2a", text: "I recommend applying a topical corticosteroid (e.g., mometasone 0.1%) once daily for 7–14 days." },
      { id: "2b", text: "An antifungal cream (e.g., clotrimazole 1%) should be applied twice daily for 2–4 weeks." },
      { id: "2c", text: "Sun protection with SPF 50+ is strongly recommended." },
    ],
  },
  {
    id: "3",
    label: "Follow-Up Instructions",
    isExpanded: false,
    snippets: [
      { id: "3a", text: "Please submit new photos in 4 weeks so we can monitor the progression." },
      { id: "3b", text: "If symptoms worsen or new lesions appear, please start a new consultation immediately." },
    ],
  },
];

let nextId = 100;
const genId = () => String(++nextId);

const MockupSnippetSettings = () => {
  const [categories, setCategories] = useState<SnippetCategory[]>(DEFAULT_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState("");

  const toggleCategory = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, isExpanded: !c.isExpanded } : c))
    );
  };

  const updateCategoryLabel = (catId: string, label: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, label } : c))
    );
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: genId(), label: newCategoryName.trim(), snippets: [], isExpanded: true },
    ]);
    setNewCategoryName("");
  };

  const addSnippet = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, snippets: [...c.snippets, { id: genId(), text: "" }] }
          : c
      )
    );
  };

  const updateSnippet = (catId: string, snippetId: string, text: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, snippets: c.snippets.map((s) => (s.id === snippetId ? { ...s, text } : s)) }
          : c
      )
    );
  };

  const deleteSnippet = (catId: string, snippetId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, snippets: c.snippets.filter((s) => s.id !== snippetId) } : c
      )
    );
  };

  const totalSnippets = categories.reduce((sum, c) => sum + c.snippets.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header – matches Profile page */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={medenaLogo} alt="Medena" className="w-8 h-8 rounded-lg" />
            <span className="font-serif font-bold text-xl text-foreground">medena</span>
          </Link>
          <Link to="/mockup-diagnosis">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Diagnosis
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content – same width as Profile page */}
      <main className="container py-8 max-w-2xl">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2 text-xs font-mono">
            MOCKUP
          </Badge>
          <h1 className="text-3xl font-bold text-foreground">Response Snippets</h1>
          <p className="text-muted-foreground mt-2">
            Create and organize predefined text snippets to speed up your consultation responses.
          </p>
        </div>

        {/* Overview card */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Snippet Overview
            </CardTitle>
            <CardDescription>
              These snippets will appear in the diagnosis view for quick insertion into your responses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FolderOpen className="h-4 w-4" />
                {categories.length} {categories.length === 1 ? "Category" : "Categories"}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquareText className="h-4 w-4" />
                {totalSnippets} {totalSnippets === 1 ? "Snippet" : "Snippets"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Snippet categories */}
        {categories.map((category) => (
          <Card key={category.id} className="shadow-card mb-8">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground">Category Name</label>
                  <Input
                    value={category.label}
                    onChange={(e) => updateCategoryLabel(category.id, e.target.value)}
                    placeholder="Category name"
                  />
                </div>
                <div className="flex items-center gap-1 pt-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCategory(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {category.snippets.length} {category.snippets.length === 1 ? "snippet" : "snippets"} in this category.
              </p>
            </CardHeader>

            {category.isExpanded && (
              <CardContent>
                <Separator className="mb-6" />
                <div className="space-y-4">
                  {category.snippets.map((snippet, idx) => (
                    <div key={snippet.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">
                          Snippet {idx + 1}
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSnippet(category.id, snippet.id)}
                          className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <Textarea
                        value={snippet.text}
                        onChange={(e) => updateSnippet(category.id, snippet.id, e.target.value)}
                        placeholder="Enter snippet text..."
                        className="min-h-[72px] text-sm"
                        rows={2}
                      />
                    </div>
                  ))}

                  {category.snippets.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      No snippets yet. Add your first one below.
                    </p>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSnippet(category.id)}
                    className="gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Snippet
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {/* Add new category */}
        <Card className="shadow-card mb-8 border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Add New Category</CardTitle>
            <CardDescription>
              Group your snippets by topic for easier access during consultations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">Category Name</label>
              <div className="flex gap-3">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Common Diagnoses"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                />
                <Button
                  onClick={addCategory}
                  disabled={!newCategoryName.trim()}
                  className="gap-1.5 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <Button variant="hero" size="lg" className="w-full gap-2">
          <Save className="h-4 w-4" />
          Save All Changes
        </Button>
      </main>
    </div>
  );
};

export default MockupSnippetSettings;
