import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Code, Copy, Check, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmbedCodeGeneratorProps {
  referralCode: string;
}

type WidgetSize = "compact" | "standard";

const sizeConfigs: Record<WidgetSize, { width: number; height: number }> = {
  compact: { width: 300, height: 180 },
  standard: { width: 350, height: 200 },
};

export const EmbedCodeGenerator = ({ referralCode }: EmbedCodeGeneratorProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "de" ? "de" : "en";
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState<WidgetSize>("standard");
  const [previewOpen, setPreviewOpen] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const widgetUrl = `${baseUrl}/widget/${referralCode}?lang=${lang}`;
  const { width, height } = sizeConfigs[selectedSize];

  const embedCode = `<iframe 
  src="${widgetUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
</iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: lang === "de" ? "Code kopiert" : "Code copied",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler beim Kopieren" : "Failed to copy",
      });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          {lang === "de" ? "Website-Widget" : "Website Widget"}
        </CardTitle>
        <CardDescription>
          {lang === "de"
            ? "Fügen Sie dieses Widget in Ihre Praxis-Website ein, damit Patienten direkt eine Beratung starten können."
            : "Add this widget to your practice website so patients can start consultations directly."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Size Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {lang === "de" ? "Widget-Größe" : "Widget Size"}
          </label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={selectedSize === "compact" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSize("compact")}
              className="flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              {lang === "de" ? "Kompakt" : "Compact"} (300×180)
            </Button>
            <Button
              type="button"
              variant={selectedSize === "standard" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSize("standard")}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              Standard (350×200)
            </Button>
          </div>
        </div>

        {/* Embed Code */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {lang === "de" ? "Einbettungscode" : "Embed Code"}
          </label>
          <Textarea
            value={embedCode}
            readOnly
            className="font-mono text-xs bg-muted min-h-[120px]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleCopy} className="flex-1">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                {lang === "de" ? "Kopiert!" : "Copied!"}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                {lang === "de" ? "Code kopieren" : "Copy Code"}
              </>
            )}
          </Button>

          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                {lang === "de" ? "Vorschau" : "Preview"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {lang === "de" ? "Widget-Vorschau" : "Widget Preview"}
                </DialogTitle>
              </DialogHeader>
              <div
                className="flex justify-center p-4 bg-muted/50 rounded-lg"
                style={{ minHeight: height + 40 }}
              >
                <iframe
                  src={widgetUrl}
                  width={width}
                  height={height}
                  frameBorder="0"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  title="Widget Preview"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {lang === "de"
                  ? "So wird das Widget auf Ihrer Website aussehen"
                  : "This is how the widget will appear on your website"}
              </p>
            </DialogContent>
          </Dialog>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
          <p className="font-medium mb-1">
            {lang === "de" ? "So verwenden Sie das Widget:" : "How to use the widget:"}
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>
              {lang === "de"
                ? "Kopieren Sie den Code oben"
                : "Copy the code above"}
            </li>
            <li>
              {lang === "de"
                ? "Fügen Sie ihn in den HTML-Code Ihrer Website ein"
                : "Paste it into your website's HTML"}
            </li>
            <li>
              {lang === "de"
                ? "Das Widget erscheint automatisch mit Ihrem Namen und Ihrer Praxis"
                : "The widget will automatically display with your name and practice"}
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbedCodeGenerator;
