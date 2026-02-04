import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  ChevronRight,
  Inbox,
  UserCheck,
  Users,
  FileText
} from "lucide-react";

interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  status: string;
  concern_category: string | null;
  consultation_type?: string | null;
  body_locations: string[] | null;
  created_at: string;
  submitted_at: string | null;
  profiles?: { full_name: string | null } | null;
}

interface ConsultationQueueProps {
  consultations: Consultation[];
  isLoading: boolean;
  activeTab: "pending" | "in_review" | "completed";
  onTabChange: (tab: "pending" | "in_review" | "completed") => void;
  onSelectConsultation: (id: string) => void;
}

const concernLabels: Record<string, { en: string; de: string }> = {
  skin: { en: "Skin Conditions", de: "Hauterkrankungen" },
  hair: { en: "Hair & Scalp", de: "Haare & Kopfhaut" },
  nails: { en: "Nail Problems", de: "Nagelprobleme" },
  infections: { en: "Infections", de: "Infektionen" },
  allergies: { en: "Allergies & Reactions", de: "Allergien & Reaktionen" },
  pigmentation: { en: "Pigmentation", de: "Pigmentierung" },
  prescription: { en: "Prescription Request", de: "Rezeptanforderung" },
};

const ConsultationQueue = ({ 
  consultations, 
  isLoading, 
  activeTab, 
  onTabChange,
  onSelectConsultation 
}: ConsultationQueueProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "de" ? "de" : "en";
  const dateLocale = lang === "de" ? de : enUS;

  const filteredConsultations = consultations.filter((c) => {
    if (activeTab === "pending") return c.status === "submitted";
    if (activeTab === "in_review") return c.status === "in_review";
    if (activeTab === "completed") return c.status === "completed";
    return false;
  });

  const pendingCount = consultations.filter(c => c.status === "submitted").length;
  const inReviewCount = consultations.filter(c => c.status === "in_review").length;
  const completedCount = consultations.filter(c => c.status === "completed").length;

  const tabs = [
    { 
      key: "pending" as const, 
      label: lang === "de" ? "Neue Anfragen" : "New Requests",
      count: pendingCount,
      icon: Clock,
    },
    { 
      key: "in_review" as const, 
      label: lang === "de" ? "In Bearbeitung" : "In Review",
      count: inReviewCount,
      icon: AlertCircle,
    },
    { 
      key: "completed" as const, 
      label: lang === "de" ? "Abgeschlossen" : "Completed",
      count: completedCount,
      icon: CheckCircle,
    },
  ];

  const getTimeSinceSubmission = (dateString: string) => {
    const submitted = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
    
    if (hours < 1) return lang === "de" ? "Vor wenigen Minuten" : "Just now";
    if (hours < 24) return lang === "de" ? `Vor ${hours} Std.` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return lang === "de" ? `Vor ${days} Tag(en)` : `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <Button
              key={tab.key}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onTabChange(tab.key)}
              className="gap-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.count > 0 && (
                <Badge 
                  variant={isActive ? "secondary" : "outline"} 
                  className="ml-1 h-5 px-1.5 text-xs"
                >
                  {tab.count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="py-4">
                <div className="animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredConsultations.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Inbox className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {activeTab === "pending" && (lang === "de" ? "Keine neuen Anfragen" : "No new requests")}
              {activeTab === "in_review" && (lang === "de" ? "Keine Fälle in Bearbeitung" : "No cases in review")}
              {activeTab === "completed" && (lang === "de" ? "Noch keine abgeschlossenen Fälle" : "No completed cases yet")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {activeTab === "pending" && (lang === "de" 
                ? "Neue Patientenanfragen werden hier erscheinen."
                : "New patient requests will appear here.")}
              {activeTab === "in_review" && (lang === "de" 
                ? "Fälle, die Sie gerade bearbeiten, werden hier angezeigt."
                : "Cases you're currently reviewing will show here.")}
              {activeTab === "completed" && (lang === "de" 
                ? "Abgeschlossene Konsultationen werden hier archiviert."
                : "Completed consultations will be archived here.")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredConsultations.map((consultation) => (
            <Card 
              key={consultation.id} 
              className="shadow-card hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => onSelectConsultation(consultation.id)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {activeTab === "pending" && <Clock className="h-6 w-6 text-primary" />}
                      {activeTab === "in_review" && <AlertCircle className="h-6 w-6 text-amber-500" />}
                      {activeTab === "completed" && <CheckCircle className="h-6 w-6 text-green-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {consultation.consultation_type === 'prescription'
                            ? concernLabels.prescription[lang]
                            : (consultation.concern_category 
                                ? concernLabels[consultation.concern_category]?.[lang] || consultation.concern_category
                                : (lang === "de" ? "Dermatologische Anfrage" : "Dermatology Consultation"))}
                        </h3>
                        {consultation.consultation_type === 'prescription' && (
                          <Badge variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-600">
                            <FileText className="h-3 w-3" />
                            {lang === "de" ? "Rezept" : "Rx"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{consultation.profiles?.full_name || (lang === "de" ? "Patient" : "Patient")}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(consultation.submitted_at || consultation.created_at), "PP", { locale: dateLocale })}
                        </span>
                      </div>
                    </div>
                  </div>
                    <div className="flex items-center gap-3">
                    {/* Assignment status indicator */}
                    {consultation.doctor_id === null ? (
                      <Badge variant="outline" className="text-xs gap-1 text-blue-600 border-blue-600">
                        <Users className="h-3 w-3" />
                        {lang === "de" ? "Pool" : "Pool"}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <UserCheck className="h-3 w-3" />
                        {lang === "de" ? "Ihr Fall" : "Your Case"}
                      </Badge>
                    )}
                    {activeTab === "pending" && (
                      <Badge variant="secondary" className="text-xs">
                        {getTimeSinceSubmission(consultation.submitted_at || consultation.created_at)}
                      </Badge>
                    )}
                    {consultation.body_locations && consultation.body_locations.length > 0 && (
                      <Badge variant="outline" className="hidden sm:inline-flex text-xs">
                        {consultation.body_locations[0]}
                        {consultation.body_locations.length > 1 && ` +${consultation.body_locations.length - 1}`}
                      </Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationQueue;
