import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, Settings, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Lang = "de" | "en";
const t = (lang: Lang, de: string, en: string) => (lang === "de" ? de : en);

interface DoctorPricing {
  standard: number;
  urgent: number;
  prescription: number;
}

const GLOBAL_DEFAULTS: DoctorPricing = { standard: 49, urgent: 74, prescription: 29 };

interface MockDoctor {
  id: string;
  name: string;
  queueType: "hybrid" | "group" | "individual";
  isActive: boolean;
  referralCode: string;
  useCustomPricing: boolean;
  pricing: DoctorPricing;
  patients: number;
  created: string;
}

const initialDoctors: MockDoctor[] = [
  { id: "1", name: "Doctor 1 Test", queueType: "hybrid", isActive: true, referralCode: "DRDOC1TEST", useCustomPricing: true, pricing: { standard: 30, urgent: 90, prescription: 15 }, patients: 2, created: "Mar 2, 2026" },
  { id: "2", name: "Doctor 3 Test", queueType: "group", isActive: true, referralCode: "DR469978DB", useCustomPricing: true, pricing: { standard: 55, urgent: 88, prescription: 12 }, patients: 0, created: "Mar 3, 2026" },
  { id: "3", name: "Dr. Jim Test2", queueType: "individual", isActive: true, referralCode: "DR07146825", useCustomPricing: false, pricing: { ...GLOBAL_DEFAULTS }, patients: 0, created: "Mar 3, 2026" },
  { id: "4", name: "Eva Narro-Bartenstein", queueType: "individual", isActive: true, referralCode: "DRF376851C", useCustomPricing: true, pricing: { standard: 90, urgent: 130, prescription: 45 }, patients: 1, created: "Mar 7, 2026" },
];

const queueBadgeVariant = (type: string) => {
  switch (type) {
    case "hybrid": return "secondary" as const;
    case "group": return "outline" as const;
    default: return "default" as const;
  }
};

const MockupDoctorSettings = () => {
  const [lang, setLang] = useState<Lang>("de");
  const [doctors, setDoctors] = useState<MockDoctor[]>(initialDoctors);

  const updatePricing = (id: string, field: keyof DoctorPricing, value: string) => {
    const num = parseInt(value) || 0;
    setDoctors((prev) =>
      prev.map((d) => d.id === id ? { ...d, pricing: { ...d.pricing, [field]: num } } : d)
    );
  };

  const toggleCustomPricing = (id: string, useCustom: boolean) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return { ...d, useCustomPricing: useCustom, pricing: useCustom ? d.pricing : { ...GLOBAL_DEFAULTS } };
      })
    );
  };

  const effectivePricing = (d: MockDoctor) => d.useCustomPricing ? d.pricing : GLOBAL_DEFAULTS;

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
          <button onClick={() => setLang("de")} className={`px-2 py-1 text-sm rounded ${lang === "de" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>DE</button>
          <button onClick={() => setLang("en")} className={`px-2 py-1 text-sm rounded ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>EN</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {t(lang, "Registrierte Ärzte", "Registered Doctors")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(lang, "Preise und Einstellungen pro Arzt verwalten.", "Manage pricing and settings per doctor.")}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">{t(lang, "Name", "Name")}</TableHead>
                <TableHead>{t(lang, "Warteschlange", "Queue Type")}</TableHead>
                <TableHead>{t(lang, "Empfehlungscode", "Referral Code")}</TableHead>
                <TableHead className="text-center">{t(lang, "Eigene Preise", "Custom Pricing")}</TableHead>
                <TableHead className="text-right">{t(lang, "Standard (€)", "Standard (€)")}</TableHead>
                <TableHead className="text-right">{t(lang, "Dringend (€)", "Urgent (€)")}</TableHead>
                <TableHead className="text-right">{t(lang, "Rezept (€)", "Rx (€)")}</TableHead>
                <TableHead className="text-center">{t(lang, "Patienten", "Patients")}</TableHead>
                <TableHead>{t(lang, "Status", "Status")}</TableHead>
                <TableHead>{t(lang, "Erstellt", "Created")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => {
                const p = effectivePricing(doctor);
                return (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                          {doctor.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{doctor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={queueBadgeVariant(doctor.queueType)} className="capitalize text-xs">
                        {doctor.queueType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-muted-foreground">{doctor.referralCode}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={doctor.useCustomPricing}
                        onCheckedChange={(checked) => toggleCustomPricing(doctor.id, checked)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {doctor.useCustomPricing ? (
                        <Input type="number" value={p.standard} onChange={(e) => updatePricing(doctor.id, "standard", e.target.value)} className="h-8 w-20 text-right ml-auto" />
                      ) : (
                        <span className="text-muted-foreground">{p.standard}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {doctor.useCustomPricing ? (
                        <Input type="number" value={p.urgent} onChange={(e) => updatePricing(doctor.id, "urgent", e.target.value)} className="h-8 w-20 text-right ml-auto" />
                      ) : (
                        <span className="text-muted-foreground">{p.urgent}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {doctor.useCustomPricing ? (
                        <Input type="number" value={p.prescription} onChange={(e) => updatePricing(doctor.id, "prescription", e.target.value)} className="h-8 w-20 text-right ml-auto" />
                      ) : (
                        <span className="text-muted-foreground">{p.prescription}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {doctor.patients > 0 ? (
                        <span className="text-primary font-medium">{doctor.patients}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={doctor.isActive ? "default" : "destructive"} className="text-xs">
                        {doctor.isActive ? t(lang, "Aktiv", "Active") : t(lang, "Inaktiv", "Inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{doctor.created}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

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
