import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, Copy, RefreshCw, Pencil, MoreHorizontal, ArrowUp, ArrowUpDown, Link } from "lucide-react";
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

interface MockDoctor {
  id: string;
  name: string;
  shortId: string;
  queueType: "Hybrid" | "Group" | "Individual";
  referralCode: string;
  pricing: string;
  platformFeePatient: number;
  vatPercentPatient: number;
  platformFeeDoctor: number;
  vatPercentDoctor: number;
  subscriptionFeeDoctor: number;
  subscriptionVatDoctor: number;
  patients: number;
  isActive: boolean;
  created: string;
}

const doctors: MockDoctor[] = [
  { id: "1", name: "Doctor 1 Test", shortId: "dd780320...", queueType: "Hybrid", referralCode: "DRDOC1TEST", pricing: "30 / 90 / 15", platformFeePatient: 9.90, vatPercentPatient: 20, platformFeeDoctor: 5.00, vatPercentDoctor: 20, subscriptionFeeDoctor: 49.00, subscriptionVatDoctor: 20, patients: 2, isActive: true, created: "Mar 2, 2026" },
  { id: "2", name: "Doctor 3 Test", shortId: "469978db...", queueType: "Group", referralCode: "DR469978DB", pricing: "55 / 88 / 12", platformFeePatient: 12.50, vatPercentPatient: 20, platformFeeDoctor: 7.50, vatPercentDoctor: 20, subscriptionFeeDoctor: 49.00, subscriptionVatDoctor: 20, patients: 0, isActive: true, created: "Mar 3, 2026" },
  { id: "3", name: "Dr. Jim Test2", shortId: "07146825...", queueType: "Individual", referralCode: "DR07146825", pricing: "60 / 90 / 10", platformFeePatient: 9.90, vatPercentPatient: 20, platformFeeDoctor: 5.00, vatPercentDoctor: 20, subscriptionFeeDoctor: 79.00, subscriptionVatDoctor: 20, patients: 0, isActive: true, created: "Mar 3, 2026" },
  { id: "4", name: "Eva Narro-Bartenstein", shortId: "f376851c...", queueType: "Individual", referralCode: "DRF376851C", pricing: "90 / 130 / 45", platformFeePatient: 15.00, vatPercentPatient: 20, platformFeeDoctor: 10.00, vatPercentDoctor: 20, subscriptionFeeDoctor: 79.00, subscriptionVatDoctor: 20, patients: 1, isActive: true, created: "Mar 7, 2026" },
];

const queueBadgeClass = (type: string) => {
  switch (type) {
    case "Hybrid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Group": return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Individual": return "bg-purple-50 text-purple-600 border-purple-200";
    default: return "";
  }
};

const MockupDoctorSettings = () => {
  const [lang, setLang] = useState<Lang>("de");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">
            {t(lang, "Arzt-Tabelle (Mockup)", "Doctor Table (Mockup)")}
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

      <div className="max-w-7xl mx-auto p-6">
        {/* Card */}
        <div className="rounded-xl border bg-card shadow-sm">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t(lang, "Registrierte Ärzte", "Registered Doctors")}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground ml-11">
              {t(lang, "Alle registrierten Ärzte auf der Plattform. Klicken Sie auf das Profilbild, um es zu ändern.", "All registered doctors on the platform. Click on the profile picture to change it.")}
            </p>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">
                  <span className="inline-flex items-center gap-1 cursor-pointer">
                    {t(lang, "Name", "Name")} <ArrowUp className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1 cursor-pointer">
                    {t(lang, "Warteschlange", "Queue Type")} <ArrowUpDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead>{t(lang, "Empfehlungslink", "Referral Link")}</TableHead>
                <TableHead>{t(lang, "Konsultationspreise (€)", "Consultation Prices (€)")}</TableHead>
                <TableHead>{t(lang, "Plattformgebühr Patienten (€ / MwSt.)", "Platform Fee to Patients (€ / VAT %)")}</TableHead>
                <TableHead>{t(lang, "Plattformgebühr Ärzte (€ / MwSt.)", "Platform Fee to Doctors (€ / VAT %)")}</TableHead>
                <TableHead>{t(lang, "Abogebühr Ärzte (€ / MwSt.)", "Subscription Fee to Doctors (€ / VAT %)")}</TableHead>
                <TableHead>{t(lang, "Patienten", "Patients")}</TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1 cursor-pointer">
                    {t(lang, "Status", "Status")} <ArrowUpDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1 cursor-pointer">
                    {t(lang, "Erstellt", "Created")} <ArrowUpDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead>{t(lang, "Aktionen", "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id} className="h-20">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{doctor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{doctor.shortId}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs font-medium ${queueBadgeClass(doctor.queueType)}`}>
                      {doctor.queueType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-foreground">{doctor.referralCode}</span>
                      <button className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                      <button className="text-muted-foreground hover:text-foreground"><RefreshCw className="h-3.5 w-3.5" /></button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-foreground">{doctor.pricing}</span>
                      <button className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-foreground">€{doctor.platformFeePatient.toFixed(2)}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-sm text-foreground">{doctor.vatPercentPatient}%</span>
                      <button className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-foreground">€{doctor.platformFeeDoctor.toFixed(2)}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-sm text-foreground">{doctor.vatPercentDoctor}%</span>
                      <button className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-foreground">€{doctor.subscriptionFeeDoctor.toFixed(2)}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-sm text-foreground">{doctor.subscriptionVatDoctor}%</span>
                      <button className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {doctor.patients > 0 ? (
                      <span className="inline-flex items-center gap-1 text-primary font-medium">
                        <Link className="h-3.5 w-3.5" /> {doctor.patients}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs">
                      {t(lang, "Aktiv", "Active")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{doctor.created}</TableCell>
                  <TableCell>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MockupDoctorSettings;
