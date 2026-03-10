import { useState } from "react";
import { FileText, Plus, Send, Save, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SNIPPET_CATEGORIES = [
  {
    label: "General Assessment",
    labelDe: "Allgemeine Beurteilung",
    snippets: [
      "Based on the submitted images and clinical history, the findings are consistent with",
      "The lesion appears benign and no immediate intervention is required.",
      "Clinical correlation is recommended. A follow-up in 4–6 weeks is advised.",
      "The images show no signs of malignancy. Routine monitoring is sufficient.",
      "Further diagnostic workup including dermoscopy or biopsy is recommended.",
    ],
  },
  {
    label: "Treatment Recommendations",
    labelDe: "Behandlungsempfehlungen",
    snippets: [
      "I recommend applying a topical corticosteroid (e.g., mometasone 0.1%) once daily for 7–14 days.",
      "An antifungal cream (e.g., clotrimazole 1%) should be applied twice daily for 2–4 weeks.",
      "Please use a mild, fragrance-free moisturizer regularly and avoid known irritants.",
      "Oral antihistamines (e.g., cetirizine 10mg) may be taken once daily to relieve itching.",
      "Sun protection with SPF 50+ is strongly recommended. Avoid direct sun exposure.",
    ],
  },
  {
    label: "Follow-Up Instructions",
    labelDe: "Nachsorge-Hinweise",
    snippets: [
      "Please submit new photos in 4 weeks so we can monitor the progression.",
      "If symptoms worsen or new lesions appear, please start a new consultation immediately.",
      "No further action is needed at this time. You may reach out if concerns arise.",
      "I recommend an in-person visit with a dermatologist for a physical examination.",
      "A biopsy is recommended. Please schedule an appointment with your local dermatologist.",
    ],
  },
  {
    label: "Common Diagnoses",
    labelDe: "Häufige Diagnosen",
    snippets: [
      "The findings are consistent with atopic dermatitis (eczema).",
      "This appears to be a case of contact dermatitis, likely triggered by an external irritant.",
      "The lesion is consistent with seborrheic keratosis – a benign skin growth.",
      "The presentation suggests psoriasis vulgaris.",
      "This appears to be tinea corporis (ringworm), a superficial fungal infection.",
      "The findings suggest acne vulgaris, grade II.",
    ],
  },
];

const MockupDiagnosisPage = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const [icd10, setIcd10] = useState("");
  const [diagnosisLabel, setDiagnosisLabel] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>(
    Object.fromEntries(SNIPPET_CATEGORIES.map((_, i) => [i, true]))
  );

  const insertSnippet = (snippet: string) => {
    setDiagnosis((prev) => {
      if (prev && !prev.endsWith(" ") && !prev.endsWith("\n")) {
        return prev + " " + snippet;
      }
      return prev + snippet;
    });
  };

  const toggleCategory = (index: number) => {
    setExpandedCategories((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Badge variant="outline" className="mb-2 text-xs font-mono">
            MOCKUP – Diagnosis Page
          </Badge>
          <h1 className="text-2xl font-bold text-foreground">Doctor's Diagnosis View</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Predefined snippets help doctors compose responses faster.
          </p>
        </div>

        {/* Single card layout */}
        <Card className="border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Doctor's Response</h2>
            </div>

            {/* Side-by-side: Textarea + Snippets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Diagnosis &amp; Recommendation
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Textarea (3/5) */}
                <div className="lg:col-span-3">
                  <Textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter your professional assessment..."
                    className="min-h-[380px] bg-accent/20 border-border text-foreground h-full"
                  />
                </div>

                {/* Snippets (2/5) */}
                <div className="lg:col-span-2 border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/50 border-b border-border">
                    <Plus className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Quick Snippets</span>
                  </div>
                  <p className="text-xs text-muted-foreground px-3 pt-2 pb-1">
                    Click to insert into diagnosis field.
                  </p>
                  <div className="space-y-1 max-h-[340px] overflow-y-auto p-2">
                    {SNIPPET_CATEGORIES.map((category, catIdx) => (
                      <div key={catIdx} className="border border-border rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleCategory(catIdx)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted transition-colors text-left"
                        >
                          <span className="text-xs font-semibold text-foreground">
                            {category.label}
                          </span>
                          {expandedCategories[catIdx] ? (
                            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </button>
                        {expandedCategories[catIdx] && (
                          <div className="p-1.5 space-y-1">
                            {category.snippets.map((snippet, snippetIdx) => (
                              <button
                                key={snippetIdx}
                                type="button"
                                onClick={() => insertSnippet(snippet)}
                                className="w-full text-left px-2.5 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded transition-colors border border-transparent hover:border-primary/20 leading-relaxed"
                              >
                                {snippet}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* ICD-10 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <label className="text-sm font-medium text-foreground">
                  ICD-10 Code (for medical fee note)
                </label>
              </div>
              <Input
                value={icd10}
                onChange={(e) => setIcd10(e.target.value)}
                placeholder="e.g. L50.0"
                className="bg-background"
              />
            </div>

            {/* Diagnosis label */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Diagnosis (optional)
              </label>
              <Input
                value={diagnosisLabel}
                onChange={(e) => setDiagnosisLabel(e.target.value)}
                placeholder="e.g. Allergic Urticaria"
                className="bg-background"
              />
            </div>

            {/* Actions */}
            <Button className="w-full mb-3" variant="hero" size="lg">
              <Send className="h-4 w-4 mr-2" />
              Send Response &amp; Complete
            </Button>
            <Button className="w-full" variant="outline" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MockupDiagnosisPage;
