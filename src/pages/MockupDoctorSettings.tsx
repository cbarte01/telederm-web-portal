import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Users, Euro, Globe } from "lucide-react";

type Lang = "de" | "en";

const t = (lang: Lang, de: string, en: string) => (lang === "de" ? de : en);

interface DoctorPricing {
  standard: number;
  urgent: number;
  prescription: number;
}

interface MockDoctor {
  id: string;
  name: string;
  email: string;
  queueType: "hybrid" | "group" | "individual";
  isActive: boolean;
  referralCode: string;
  useCustomPricing: boolean;
  pricing: DoctorPricing;
}

const GLOBAL_DEFAULTS: DoctorPricing = {
  standard: 49,
  urgent: 74,
  prescription: 29,
};

const initialDoctors: MockDoctor[] = [
  {
    id: "1",
    name: "Doctor 1 Test",
    email: "doctor1@test.com",
    queueType: "hybrid",
    isActive: true,
    referralCode: "DOC1TEST",
    useCustomPricing: true,
    pricing: { standard: 30, urgent: 90, prescription: 15 },
  },
  {
    id: "2",
    name: "Doctor 3 Test",
    email: "doctor3@test.com",
    queueType: "group",
    isActive: true,
    referralCode: "DOC3TEST",
    useCustomPricing: true,
    pricing: { standard: 55, urgent: 88, prescription: 12 },
  },
  {
    id: "3",
    name: "Dr. Jim Test2",
    email: "jim.test2@example.com",
    queueType: "individual",
    isActive: true,
    referralCode: "JIMTEST2",
    useCustomPricing: false,
    pricing: { standard: 49, urgent: 74, prescription: 29 },
  },
  {
    id: "4",
    name: "Eva Narro-Bartenstein",
    email: "eva.narro@example.com",
    queueType: "individual",
    isActive: true,
    referralCode: "EVANARRO",
    useCustomPricing: true,
    pricing: { standard: 90, urgent: 130, prescription: 45 },
  },
];

const queueBadgeVariant = (type: string) => {
  switch (type) {
    case "hybrid":
      return "secondary";
    case "group":
      return "outline";
    case "individual":
      return "default";
    default:
      return "outline";
  }
};

const MockupDoctorSettings = () => {
  const [lang, setLang] = useState<Lang>("de");
  const [doctors, setDoctors] = useState<MockDoctor[]>(initialDoctors);

  const updateDoctor = (id: string, updates: Partial<MockDoctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const updatePricing = (id: string, field: keyof DoctorPricing, value: string) => {
    const num = parseInt(value) || 0;
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, pricing: { ...d.pricing, [field]: num } } : d
      )
    );
  };

  const toggleCustomPricing = (id: string, useCustom: boolean) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          useCustomPricing: useCustom,
          pricing: useCustom ? d.pricing : { ...GLOBAL_DEFAULTS },
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold text-foreground">
            {t(lang, "Arzt-Einstellungen (Mockup)", "Doctor Settings (Mockup)")}
          </h1>
          <Badge variant="outline" className="text-xs">
            {t(lang, "Nur Vorschau", "Preview Only")}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => setLang("de")}
            className={`px-2 py-1 text-sm rounded ${lang === "de" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            DE
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Global defaults card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Euro className="h-4 w-4" />
              {t(lang, "Globale Standardpreise", "Global Default Pricing")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">
                  {t(lang, "Standard", "Standard")}
                </p>
                <p className="text-xl font-semibold text-foreground">€{GLOBAL_DEFAULTS.standard}</p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">
                  {t(lang, "Dringend", "Urgent")}
                </p>
                <p className="text-xl font-semibold text-foreground">€{GLOBAL_DEFAULTS.urgent}</p>
              </div>
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">
                  {t(lang, "Rezept", "Prescription")}
                </p>
                <p className="text-xl font-semibold text-foreground">€{GLOBAL_DEFAULTS.prescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctors list */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {t(lang, `${doctors.length} Ärzte`, `${doctors.length} Doctors`)}
        </div>

        <div className="space-y-4">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className={doctor.useCustomPricing ? "border-primary/30" : ""}
            >
              <CardContent className="p-5">
                {/* Doctor header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {doctor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={queueBadgeVariant(doctor.queueType)} className="text-xs capitalize">
                      {doctor.queueType}
                    </Badge>
                    <Badge
                      variant={doctor.isActive ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {doctor.isActive
                        ? t(lang, "Aktiv", "Active")
                        : t(lang, "Inaktiv", "Inactive")}
                    </Badge>
                  </div>
                </div>

                {/* Referral code */}
                <div className="text-xs text-muted-foreground mb-3">
                  {t(lang, "Empfehlungscode", "Referral Code")}:{" "}
                  <span className="font-mono text-foreground">{doctor.referralCode}</span>
                </div>

                <Separator className="mb-4" />

                {/* Pricing toggle */}
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor={`custom-${doctor.id}`} className="text-sm cursor-pointer">
                    {t(lang, "Individuelle Preise", "Custom Pricing")}
                  </Label>
                  <Switch
                    id={`custom-${doctor.id}`}
                    checked={doctor.useCustomPricing}
                    onCheckedChange={(checked) => toggleCustomPricing(doctor.id, checked)}
                  />
                </div>

                {/* Pricing fields */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t(lang, "Standard (€)", "Standard (€)")}
                    </Label>
                    {doctor.useCustomPricing ? (
                      <Input
                        type="number"
                        value={doctor.pricing.standard}
                        onChange={(e) => updatePricing(doctor.id, "standard", e.target.value)}
                        className="mt-1 h-9"
                      />
                    ) : (
                      <p className="mt-1 h-9 flex items-center text-sm text-muted-foreground">
                        €{GLOBAL_DEFAULTS.standard}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t(lang, "Dringend (€)", "Urgent (€)")}
                    </Label>
                    {doctor.useCustomPricing ? (
                      <Input
                        type="number"
                        value={doctor.pricing.urgent}
                        onChange={(e) => updatePricing(doctor.id, "urgent", e.target.value)}
                        className="mt-1 h-9"
                      />
                    ) : (
                      <p className="mt-1 h-9 flex items-center text-sm text-muted-foreground">
                        €{GLOBAL_DEFAULTS.urgent}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {t(lang, "Rezept (€)", "Prescription (€)")}
                    </Label>
                    {doctor.useCustomPricing ? (
                      <Input
                        type="number"
                        value={doctor.pricing.prescription}
                        onChange={(e) => updatePricing(doctor.id, "prescription", e.target.value)}
                        className="mt-1 h-9"
                      />
                    ) : (
                      <p className="mt-1 h-9 flex items-center text-sm text-muted-foreground">
                        €{GLOBAL_DEFAULTS.prescription}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={() => alert(t(lang, "Mockup — keine Aktion", "Mockup — no action"))}>
            {t(lang, "Alle Änderungen speichern", "Save All Changes")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MockupDoctorSettings;
