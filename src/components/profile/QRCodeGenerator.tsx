import { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download, Image, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import medenaLogo from "@/assets/logo/medena-logo.png";

interface QRCodeGeneratorProps {
  referralCode: string;
}

export const QRCodeGenerator = ({ referralCode }: QRCodeGeneratorProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "de" ? "de" : "en";
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralUrl = `${baseUrl}/consultation?ref=${referralCode}`;

  const downloadPNG = useCallback(async () => {
    try {
      // Create a high-resolution canvas for download
      const canvas = document.createElement("canvas");
      const size = 1024;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Draw white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Create temporary QR code at high resolution
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Render QR code to the temp canvas
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

      // Convert to blob and download
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

      // Clone and prepare SVG for download
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
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          {lang === "de" ? "QR-Code" : "QR Code"}
        </CardTitle>
        <CardDescription>
          {lang === "de"
            ? "Drucken Sie diesen QR-Code auf Visitenkarten, Poster oder Praxismaterialien."
            : "Print this QR code on business cards, posters or practice materials."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
