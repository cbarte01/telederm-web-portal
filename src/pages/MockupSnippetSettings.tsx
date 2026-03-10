import { useState } from "react";
import { Plus, Trash2, GripVertical, Save, ArrowLeft, ChevronDown, ChevronUp, MessageSquareText, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

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
          ? {
              ...c,
              snippets: c.snippets.map((s) =>
                s.id === snippetId ? { ...s, text } : s
              ),
            }
          : c
      )
    );
  };

  const deleteSnippet = (catId: string, snippetId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, snippets: c.snippets.filter((s) => s.id !== snippetId) }
          : c
      )
    );
  };

  const totalSnippets = categories.reduce((sum, c) => sum + c.snippets.length, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/mockup-diagnosis">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <Badge variant="outline" className="mb-1 text-xs font-mono">
              MOCKUP – Settings
            </Badge>
            <h1 className="text-xl font-bold text-foreground">Response Snippets</h1>
          </div>
          <Button variant="hero" className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Info card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" />
              Quick Response Snippets
            </CardTitle>
            <CardDescription>
              Create and organize predefined text snippets to speed up your consultation responses.
              These snippets will appear in the diagnosis view for quick insertion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

        {/* Categories */}
        {categories.map((category) => (
          <Card key={category.id} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 cursor-grab" />
                <div className="flex-1">
                  <Input
                    value={category.label}
                    onChange={(e) => updateCategoryLabel(category.id, e.target.value)}
                    className="text-base font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0 bg-transparent"
                    placeholder="Category name"
                  />
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {category.snippets.length} {category.snippets.length === 1 ? "snippet" : "snippets"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleCategory(category.id)}
                  className="shrink-0"
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
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {category.isExpanded && (
              <CardContent className="pt-0">
                <Separator className="mb-4" />
                <div className="space-y-3">
                  {category.snippets.map((snippet, idx) => (
                    <div key={snippet.id} className="flex items-start gap-2">
                      <span className="text-xs text-muted-foreground mt-2.5 w-5 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <Textarea
                        value={snippet.text}
                        onChange={(e) => updateSnippet(category.id, snippet.id, e.target.value)}
                        placeholder="Enter snippet text..."
                        className="min-h-[60px] text-sm bg-accent/20"
                        rows={2}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSnippet(category.id, snippet.id)}
                        className="shrink-0 mt-0.5 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}

                  {category.snippets.length === 0 && (
                    <p className="text-sm text-muted-foreground italic py-2">
                      No snippets yet. Add your first one below.
                    </p>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSnippet(category.id)}
                    className="gap-1.5 mt-1"
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
        <Card className="shadow-card border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-muted-foreground shrink-0" />
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
              />
              <Button
                variant="outline"
                onClick={addCategory}
                disabled={!newCategoryName.trim()}
                className="gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MockupSnippetSettings;
