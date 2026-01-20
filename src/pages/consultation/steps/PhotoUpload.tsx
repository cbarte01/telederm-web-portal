import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Camera, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConsultationDraft, ConsultationPhoto, PhotoType } from "@/types/consultation";

interface PhotoUploadProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

const PHOTO_TYPES: PhotoType[] = ["closeup", "context", "additional"];

const PhotoUpload = ({ draft, updateDraft, onNext }: PhotoUploadProps) => {
  const { t } = useTranslation("consultation");
  const fileInputRefs = useRef<Record<PhotoType, HTMLInputElement | null>>({
    closeup: null,
    context: null,
    additional: null,
  });

  const getPhoto = (type: PhotoType): ConsultationPhoto | undefined => {
    return draft.photos.find(p => p.type === type);
  };

  const handleFileSelect = (type: PhotoType, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto: ConsultationPhoto = {
        type,
        file,
        preview: reader.result as string,
      };
      
      const existingPhotos = draft.photos.filter(p => p.type !== type);
      updateDraft({ photos: [...existingPhotos, newPhoto] });
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (type: PhotoType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(type, file);
    }
  };

  const removePhoto = (type: PhotoType) => {
    updateDraft({ photos: draft.photos.filter(p => p.type !== type) });
  };

  const hasRequiredPhotos = draft.photos.some(p => p.type === "closeup") && 
                            draft.photos.some(p => p.type === "context");

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {t("step4.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("step4.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        {PHOTO_TYPES.map(type => {
          const photo = getPhoto(type);
          const isOptional = type === "additional";
          
          return (
            <div
              key={type}
              className={cn(
                "relative rounded-xl border-2 transition-all overflow-hidden",
                photo ? "border-primary bg-primary/5" : "border-dashed border-border bg-card"
              )}
            >
              {photo?.preview ? (
                <div className="relative aspect-video">
                  <img
                    src={photo.preview}
                    alt={t(`step4.photos.${type}.title`)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-white font-medium text-sm">
                      {t(`step4.photos.${type}.title`)}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8"
                    onClick={() => removePhoto(type)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {t(`step4.photos.${type}.title`)}
                        {isOptional && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            (optional)
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`step4.photos.${type}.description`)}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[type]?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t("step4.upload")}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={(el) => { fileInputRefs.current[type] = el; }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleInputChange(type, e)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={!hasRequiredPhotos}
      >
        {t("flow.next")}
      </Button>
    </div>
  );
};

export default PhotoUpload;
