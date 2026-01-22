import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Trash2, Loader2, User, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DoctorAvatarManagerProps {
  doctorId: string;
  doctorName: string | null;
  currentAvatarUrl: string | null;
  onAvatarChange: () => void;
}

export const DoctorAvatarManager = ({
  doctorId,
  doctorName,
  currentAvatarUrl,
  onAvatarChange,
}: DoctorAvatarManagerProps) => {
  const { t, i18n } = useTranslation("auth");
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = i18n.language === "de" ? "de" : "en";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: lang === "de" ? "Ungültiger Dateityp" : "Invalid file type",
        description: lang === "de" 
          ? "Bitte wählen Sie eine Bilddatei aus" 
          : "Please select an image file",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: lang === "de" ? "Datei zu groß" : "File too large",
        description: lang === "de" 
          ? "Die maximale Dateigröße beträgt 5MB" 
          : "Maximum file size is 5MB",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split("/doctor-avatars/")[1];
        if (oldPath) {
          await supabase.storage.from("doctor-avatars").remove([oldPath]);
        }
      }

      // Generate unique filename
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${doctorId}/${Date.now()}.${fileExt}`;

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("doctor-avatars")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("doctor-avatars")
        .getPublicUrl(fileName);

      // Avoid tight coupling to generated DB types
      const db = supabase as any;

      // Update doctor_public_profiles with new avatar URL
      const { error: updateError } = await db
        .from("doctor_public_profiles")
        .upsert(
          {
            doctor_id: doctorId,
            avatar_url: publicUrl,
            display_name: doctorName || "Doctor",
          },
          { onConflict: "doctor_id" }
        );

      if (updateError) throw updateError;

      toast({
        title: lang === "de" ? "Avatar hochgeladen" : "Avatar uploaded",
        description: lang === "de" 
          ? "Das Profilbild wurde erfolgreich aktualisiert" 
          : "Profile picture has been updated successfully",
      });

      onAvatarChange();
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Upload fehlgeschlagen" : "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentAvatarUrl) return;

    setIsDeleting(true);
    try {
      // Extract path from URL
      const pathMatch = currentAvatarUrl.split("/doctor-avatars/")[1];
      if (pathMatch) {
        const { error: deleteError } = await supabase.storage
          .from("doctor-avatars")
          .remove([pathMatch]);

        if (deleteError) throw deleteError;
      }

      // Avoid tight coupling to generated DB types
      const db = supabase as any;

      // Update doctor_public_profiles to remove avatar URL
      const { error: updateError } = await db
        .from("doctor_public_profiles")
        .update({ avatar_url: null })
        .eq("doctor_id", doctorId);

      if (updateError) throw updateError;

      toast({
        title: lang === "de" ? "Avatar gelöscht" : "Avatar deleted",
        description: lang === "de" 
          ? "Das Profilbild wurde entfernt" 
          : "Profile picture has been removed",
      });

      onAvatarChange();
      handleClose();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Löschen fehlgeschlagen" : "Delete failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full relative group"
        onClick={() => setIsOpen(true)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentAvatarUrl || undefined} alt={doctorName || "Doctor"} />
          <AvatarFallback className="bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-3 w-3 text-white" />
        </div>
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === "de" ? "Arzt-Avatar verwalten" : "Manage Doctor Avatar"}
            </DialogTitle>
            <DialogDescription>
              {lang === "de" 
                ? `Profilbild für ${doctorName || "Arzt"} hochladen oder ändern`
                : `Upload or change profile picture for ${doctorName || "Doctor"}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={displayUrl || undefined} alt={doctorName || "Doctor"} />
              <AvatarFallback className="bg-primary/10 text-2xl">
                <User className="h-12 w-12 text-primary" />
              </AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isDeleting}
              >
                <Upload className="h-4 w-4 mr-2" />
                {lang === "de" ? "Bild auswählen" : "Select Image"}
              </Button>

              {currentAvatarUrl && !selectedFile && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isUploading}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  {lang === "de" ? "Löschen" : "Delete"}
                </Button>
              )}
            </div>

            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isUploading || isDeleting}>
              {lang === "de" ? "Abbrechen" : "Cancel"}
            </Button>
            {selectedFile && (
              <Button onClick={handleUpload} disabled={isUploading || isDeleting}>
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {lang === "de" ? "Hochladen" : "Upload"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
