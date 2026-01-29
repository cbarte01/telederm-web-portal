import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Building } from "lucide-react";

interface PracticeLogoUploadProps {
  userId: string;
  currentLogoUrl: string | null;
  onLogoChange: (url: string | null) => void;
}

const PracticeLogoUpload = ({ userId, currentLogoUrl, onLogoChange }: PracticeLogoUploadProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "de" ? "de" : "en";
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      if (!currentLogoUrl) {
        setPreviewUrl(null);
        return;
      }
      // If it's a full URL, use it directly
      if (currentLogoUrl.startsWith('http')) {
        setPreviewUrl(currentLogoUrl);
        return;
      }
      // Otherwise get the public URL from storage
      const { data } = supabase.storage
        .from('practice-logos')
        .getPublicUrl(currentLogoUrl);
      
      if (data?.publicUrl) {
        setPreviewUrl(data.publicUrl);
      }
    };

    loadLogo();
  }, [currentLogoUrl]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: lang === "de" ? "Ungültiger Dateityp" : "Invalid file type",
        description: lang === "de" ? "Bitte laden Sie ein Bild hoch (PNG oder JPEG)." : "Please upload an image (PNG or JPEG).",
      });
      return;
    }

    // Validate file size (500KB max)
    if (file.size > 524288) {
      toast({
        variant: "destructive",
        title: lang === "de" ? "Datei zu groß" : "File too large",
        description: lang === "de" ? "Die Datei darf maximal 500KB groß sein." : "File must be 500KB or smaller.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const filePath = `${userId}/logo.${fileExt}`;

      // Delete existing logo if exists
      await supabase.storage.from('practice-logos').remove([filePath]);

      // Upload new logo
      const { error: uploadError } = await supabase.storage
        .from('practice-logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('practice-logos')
        .getPublicUrl(filePath);

      // Update profile with storage path
      const db = supabase as any;
      const { error: updateError } = await db
        .from('profiles')
        .update({ practice_logo_url: filePath })
        .eq('id', userId);

      if (updateError) throw updateError;

      setPreviewUrl(publicUrlData.publicUrl);
      onLogoChange(filePath);
      
      toast({
        title: lang === "de" ? "Logo hochgeladen" : "Logo uploaded",
      });
    } catch (err) {
      console.error("Error uploading logo:", err);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler beim Hochladen" : "Upload failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentLogoUrl) return;

    setIsUploading(true);
    try {
      // Remove from storage
      await supabase.storage.from('practice-logos').remove([currentLogoUrl]);

      // Update profile
      const db = supabase as any;
      const { error } = await db
        .from('profiles')
        .update({ practice_logo_url: null })
        .eq('id', userId);

      if (error) throw error;

      setPreviewUrl(null);
      onLogoChange(null);
      
      toast({
        title: lang === "de" ? "Logo entfernt" : "Logo removed",
      });
    } catch (err) {
      console.error("Error removing logo:", err);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler beim Entfernen" : "Removal failed",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-t border-border pt-6 mt-6">
      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
        <Building className="h-4 w-4" />
        {lang === "de" ? "Praxis-Logo" : "Practice Logo"}
      </h4>
      <p className="text-sm text-muted-foreground mb-4">
        {lang === "de" 
          ? "Laden Sie Ihr Praxis-Logo hoch (wird auf Honorarnoten angezeigt). Empfohlen: 200x80px, max. 500KB."
          : "Upload your practice logo (displayed on medical fee notes). Recommended: 200x80px, max 500KB."}
      </p>
      
      {previewUrl ? (
        <div className="flex items-center gap-4">
          <div className="border border-border rounded-lg p-3 bg-muted/30">
            <img 
              src={previewUrl} 
              alt="Practice logo" 
              className="max-w-[200px] max-h-[80px] object-contain" 
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {lang === "de" ? "Entfernen" : "Remove"}
          </Button>
        </div>
      ) : (
        <div>
          <label htmlFor="logo-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors text-center">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {lang === "de" ? "Klicken Sie zum Hochladen" : "Click to upload"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG (max. 500KB)
                  </p>
                </>
              )}
            </div>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
};

export default PracticeLogoUpload;
