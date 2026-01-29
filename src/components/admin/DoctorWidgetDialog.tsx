import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Check, ExternalLink, Monitor, Smartphone, QrCode, Download, Image, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { useRef, useCallback } from "react";

interface DoctorWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorName: string | null;
  referralCode: string;
}

type WidgetSize = "compact" | "standard";

const sizeConfigs: Record<WidgetSize, { width: number; height: number }> = {
  compact: { width: 300, height: 180 },
  standard: { width: 350, height: 200 },
};

export const DoctorWidgetDialog = ({
  open,
  onOpenChange,
  doctorName,
  referralCode,
}: DoctorWidgetDialogProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "de" ? "de" : "en";
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState<WidgetSize>("standard");
  const [previewOpen, setPreviewOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const widgetUrl = `${baseUrl}/widget/${referralCode}?lang=${lang}`;
  const referralUrl = `${baseUrl}/consultation?ref=${referralCode}`;
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

  const downloadPNG = useCallback(async () => {
    try {
      const canvas = document.createElement("canvas");
      const size = 1024;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempDiv);

      await new Promise<void>((resolve) => {
        root.render(
          <QRCodeCanvas
            value={referralUrl}
            size={size - 80}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
            includeMargin={false}
          />
        );
        setTimeout(resolve, 100);
      });

      const qrCanvas = tempDiv.querySelector("canvas");
      if (qrCanvas) {
        ctx.drawImage(qrCanvas, 40, 40, size - 80, size - 80);
      }

      root.unmount();
      document.body.removeChild(tempDiv);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `medena-qr-${referralCode}.png`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
          title: lang === "de" ? "PNG heruntergeladen" : "PNG downloaded",
        });
      }, "image/png");
    } catch (error) {
      console.error("Error downloading PNG:", error);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler beim Download" : "Download failed",
      });
    }
  }, [referralUrl, referralCode, lang, toast]);

  const downloadSVG = useCallback(() => {
    try {
      const svgElement = canvasRef.current?.querySelector("svg");
      if (!svgElement) {
        throw new Error("SVG element not found");
      }

      const svgClone = svgElement.cloneNode(true) as SVGElement;
      svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svgClone.setAttribute("width", "1024");
      svgClone.setAttribute("height", "1024");

      const svgString = new XMLSerializer().serializeToString(svgClone);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `medena-qr-${referralCode}.svg`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: lang === "de" ? "SVG heruntergeladen" : "SVG downloaded",
      });
    } catch (error) {
      console.error("Error downloading SVG:", error);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler beim Download" : "Download failed",
      });
    }
  }, [referralCode, lang, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            {lang === "de" ? "Website-Integration" : "Website Integration"}
          </DialogTitle>
          <DialogDescription>
            {lang === "de"
              ? `Widgets und QR-Codes für ${doctorName || "Arzt"}`
              : `Widgets and QR codes for ${doctorName || "Doctor"}`}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="widget" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="widget" className="gap-2">
              <Code className="h-4 w-4" />
              {lang === "de" ? "Website-Widget" : "Website Widget"}
            </TabsTrigger>
            <TabsTrigger value="qrcode" className="gap-2">
              <QrCode className="h-4 w-4" />
              {lang === "de" ? "QR-Code" : "QR Code"}
            </TabsTrigger>
          </TabsList>

          {/* Website Widget Tab */}
          <TabsContent value="widget" className="space-y-4 mt-4">
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
                <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {lang === "de" ? "Vorschau" : "Preview"}
                </Button>
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
                      ? "So wird das Widget auf der Website aussehen"
                      : "This is how the widget will appear on the website"}
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
                    ? "Fügen Sie ihn in den HTML-Code der Praxis-Website ein"
                    : "Paste it into the practice website's HTML"}
                </li>
                <li>
                  {lang === "de"
                    ? "Das Widget erscheint automatisch mit dem Arztprofil"
                    : "The widget will automatically display with the doctor's profile"}
                </li>
              </ol>
            </div>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qrcode" className="space-y-4 mt-4">
            {/* QR Code Preview */}
            <div className="flex justify-center">
              <div
                ref={canvasRef}
                className="bg-white p-4 rounded-lg border shadow-sm"
              >
                <QRCodeSVG
                  value={referralUrl}
                  size={200}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                  includeMargin={false}
                />
              </div>
            </div>

            {/* URL Display */}
            <p className="text-xs text-muted-foreground text-center break-all">
              {referralUrl}
            </p>

            {/* Download Buttons */}
            <div className="flex gap-2">
              <Button onClick={downloadPNG} variant="default" className="flex-1">
                <Image className="h-4 w-4 mr-2" />
                {lang === "de" ? "PNG herunterladen" : "Download PNG"}
              </Button>
              <Button onClick={downloadSVG} variant="outline" className="flex-1">
                <FileCode className="h-4 w-4 mr-2" />
                {lang === "de" ? "SVG herunterladen" : "Download SVG"}
              </Button>
            </div>

            {/* Usage Tips */}
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <p className="font-medium mb-1">
                {lang === "de" ? "Verwendungstipps:" : "Usage tips:"}
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  {lang === "de"
                    ? "PNG: Für Druckmaterialien und digitale Medien"
                    : "PNG: For print materials and digital media"}
                </li>
                <li>
                  {lang === "de"
                    ? "SVG: Für hochauflösenden Druck in beliebiger Größe"
                    : "SVG: For high-resolution printing at any size"}
                </li>
                <li>
                  {lang === "de"
                    ? "Ideal für Visitenkarten, Wartezimmer-Poster, Rezeptblöcke"
                    : "Ideal for business cards, waiting room posters, prescription pads"}
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorWidgetDialog;
