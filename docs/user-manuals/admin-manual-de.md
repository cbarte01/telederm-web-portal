# Medena Care Administratorhandbuch

Willkommen zum Medena Care Administratorhandbuch. Dieses Handbuch behandelt die Plattformverwaltung, die Arzt-Kontoadministration, Preiskonfiguration und Systemeinstellungen.

---

## Inhaltsverzeichnis

1. [Einführung](#1-einführung)
2. [Zugang zum Admin-Dashboard](#2-zugang-zum-admin-dashboard)
3. [Dashboard-Übersicht](#3-dashboard-übersicht)
4. [Ärzteverwaltung](#4-ärzteverwaltung)
5. [Patientenverwaltung](#5-patientenverwaltung)
6. [Preiskonfiguration](#6-preiskonfiguration)
7. [Systemeinstellungen](#7-systemeinstellungen)
8. [Sicherheits-Best-Practices](#8-sicherheits-best-practices)
9. [Fehlerbehebung](#9-fehlerbehebung)

---

## 1. Einführung

Als Medena Care Administrator haben Sie vollen Zugriff auf die Plattformverwaltung:

- **Arztkonten**: Erstellen, aktivieren, deaktivieren und löschen von Arztprofilen
- **Patientenübersicht**: Patientenlisten und Konsultationsstatistiken einsehen
- **Preiskontrolle**: Globale und individuelle Preisstaffelungen konfigurieren
- **Plattform-Monitoring**: Konsultationsvolumen und Wartezeiten verfolgen

### Rollenhierarchie

| Rolle | Zugriffsebene |
|-------|---------------|
| Admin | Voller Plattformzugang, Benutzerverwaltung, Preiskontrolle |
| Arzt | Eigene Konsultationen, Profileinstellungen, Empfehlungs-Tools |
| Patient | Eigene Konsultationen, Profileinstellungen |

---

## 2. Zugang zum Admin-Dashboard

### Login-URL

Zugang zum Admin-Login unter: `/auth/admin`

> **Hinweis**: Der Admin-Login ist aus Sicherheitsgründen von den Patienten- und Arztportalen getrennt.

### Ersteinrichtung

Admin-Konten werden über einen sicheren Seeding-Prozess erstellt und können nicht selbst registriert werden. Kontaktieren Sie Ihren Systemadministrator, wenn Sie Admin-Zugangsdaten benötigen.

### Anmeldeprozess

1. Navigieren Sie zur Admin-Login-Seite
2. Geben Sie Ihre Admin-E-Mail und Ihr Passwort ein
3. Klicken Sie auf **Anmelden**
4. Sie werden zum Admin-Dashboard weitergeleitet

---

## 3. Dashboard-Übersicht

Das Admin-Dashboard bietet eine umfassende Ansicht der Plattformaktivität.

### Navigations-Tabs

| Tab | Beschreibung |
|-----|--------------|
| **Patienten** | Liste aller registrierten Patienten mit Konsultationszählung |
| **Ärzte** | Ärzteverwaltung mit Status- und Warteschlangentyp-Kontrollen |
| **Einstellungen** | Globale Preiskonfiguration |

### Wichtige Kennzahlen

Das Dashboard zeigt Echtzeit-Statistiken:

- **Gesamt Patienten**: Anzahl der registrierten Patientenkonten
- **Gesamt Ärzte**: Anzahl der Arztkonten (aktiv und inaktiv)
- **Aktive Konsultationen**: Fälle aktuell in Bearbeitung
- **Abgeschlossene Konsultationen**: Gesamtzahl der fertigen Konsultationen

---

## 4. Ärzteverwaltung

### Ärzte anzeigen

Der **Ärzte**-Tab zeigt alle Arztkonten mit folgenden Informationen:

| Spalte | Beschreibung |
|--------|--------------|
| Name | Vollständiger Name des Arztes |
| E-Mail | Login-E-Mail-Adresse |
| Warteschlangentyp | Gruppe, Individuell oder Hybrid |
| Status | Aktiv oder Inaktiv |
| Preise | Individuelle Preisüberschreibungen (falls gesetzt) |
| Erstellt | Kontoerstellungsdatum |

### Ein Arztkonto erstellen

1. Klicken Sie auf den **Arzt erstellen**-Button
2. Füllen Sie die erforderlichen Felder aus:
   - **Vollständiger Name**: Anzeigename des Arztes
   - **E-Mail**: Login-E-Mail (muss eindeutig sein)
   - **Passwort**: Anfangspasswort (Arzt sollte beim ersten Login ändern)
   - **Warteschlangentyp**: Konsultations-Routing-Modus auswählen
3. Klicken Sie auf **Konto erstellen**

Der Arzt erhält seine Zugangsdaten und kann sich sofort anmelden.

### Warteschlangentypen erklärt

| Typ | Verhalten |
|-----|-----------|
| **Gruppe** | Arzt erhält Fälle aus der gemeinsamen Plattform-Warteschlange |
| **Individuell** | Arzt erhält nur Fälle über seinen persönlichen Empfehlungslink |
| **Hybrid** | Arzt erhält sowohl Gruppen-Warteschlangen- als auch individuelle Empfehlungsfälle |

### Ärzte aktivieren/deaktivieren

1. Finden Sie den Arzt in der Liste
2. Klicken Sie auf den Status-Schalter oder das Aktionsmenü
3. Wählen Sie **Aktivieren** oder **Deaktivieren**

> **Hinweis**: Deaktivierte Ärzte können sich nicht anmelden oder neue Konsultationen erhalten, aber ihre historischen Daten bleiben erhalten.

### Ein Arztkonto löschen

1. Klicken Sie auf das Aktionsmenü (⋮) neben dem Arzt
2. Wählen Sie **Konto löschen**
3. Bestätigen Sie die Löschung

> **Warnung**: Die Löschung ist endgültig. Erwägen Sie stattdessen eine Deaktivierung, falls Sie das Konto später benötigen könnten.

### Arzt-Avatare verwalten

1. Klicken Sie in der Arztzeile auf den Avatar oder Avatar-Platzhalter
2. Laden Sie ein professionelles Foto hoch (empfohlen: 400x400px, JPG/PNG)
3. Der Avatar erscheint in den öffentlichen Arztlistungen

### Individuelle Preise bearbeiten

1. Klicken Sie auf den **Preise bearbeiten**-Button für einen bestimmten Arzt
2. Geben Sie benutzerdefinierte Preise ein für:
   - Standard-Konsultation (€)
   - Dringliche Konsultation (€)
   - Rezeptanforderung (€)
3. Änderungen speichern

> **Hinweis**: Individuelle Preise überschreiben die globalen Standardwerte für die Konsultationen dieses Arztes.

---

## 5. Patientenverwaltung

### Patienten anzeigen

Der **Patienten**-Tab zeigt alle registrierten Patienten:

| Spalte | Beschreibung |
|--------|--------------|
| Name | Vollständiger Name des Patienten |
| E-Mail | Registrierungs-E-Mail |
| Laufende Fälle | Anzahl aktiver Konsultationen |
| Wartezeit | Zeit seit der ältesten ausstehenden Konsultation |
| Erstellt | Kontoregistrierungsdatum |

### Sortieroptionen

Klicken Sie auf Spaltenüberschriften zum Sortieren nach:
- Name (alphabetisch)
- Laufende Fälle (meiste zuerst)
- Wartezeit (längste Wartezeit zuerst)
- Registrierungsdatum

### Wartezeit-Indikator

Die Wartezeit-Spalte zeigt, wie lange die älteste ausstehende Konsultation des Patienten wartet:

- **< 24h**: Anzeige in Stunden (z.B. "5h")
- **≥ 24h**: Anzeige in Tagen und Stunden (z.B. "2d 14h")

Dies hilft, Patienten zu identifizieren, die möglicherweise vorrangige Aufmerksamkeit benötigen.

---

## 6. Preiskonfiguration

### Zugang zu Preiseinstellungen

1. Gehen Sie zum **Einstellungen**-Tab
2. Finden Sie den Abschnitt **Gruppenpreise**

### Globale Preisstaffelungen

| Stufe | Standardpreis | Beschreibung |
|-------|---------------|--------------|
| Standard | €49 | Reguläre Konsultation, 48-Stunden-Antwort |
| Dringend | €74 | Prioritäts-Konsultation, 24-Stunden-Antwort |
| Rezept | €29 | Medikamenten-Erneuerungsanfrage |

### Globale Preise bearbeiten

1. Im Einstellungen-Tab finden Sie die Preis-Eingabefelder
2. Geben Sie neue Preise für jede Stufe ein
3. Klicken Sie auf **Änderungen speichern**

> **Wichtig**: Globale Preise gelten für alle Ärzte, sofern keine individuellen Überschreibungen gesetzt sind.

### Individuelle Arztpreise

Um benutzerdefinierte Preise für einen bestimmten Arzt festzulegen:

1. Gehen Sie zum **Ärzte**-Tab
2. Finden Sie den Arzt und klicken Sie auf **Preise bearbeiten**
3. Geben Sie benutzerdefinierte Werte für jede Stufe ein
4. Änderungen speichern

Die Konsultationen des Arztes verwenden dann seine individuellen Preise anstelle der globalen Standardwerte.

### Preisanzeige

- **Öffentliche Website**: Zeigt fest codierte Preise (€49/€74) für Konsistenz
- **Checkout-Ablauf**: Verwendet tatsächlich konfigurierte Preise aus der Datenbank
- **Rechnungen/Honorarnoten**: Spiegeln den tatsächlich berechneten Betrag wider

---

## 7. Systemeinstellungen

### Plattformkonfiguration

Der Einstellungen-Tab enthält:

| Einstellung | Beschreibung |
|-------------|--------------|
| Gruppenpreise | Standardpreise für alle Konsultationsstufen |
| E-Mail automatisch bestätigen | Ob neue Patienten E-Mail-Verifizierung benötigen |

### Empfehlungscode-Verwaltung

Empfehlungscodes werden auf Arztebene verwaltet:

1. Gehen Sie zum **Ärzte**-Tab
2. Klicken Sie auf das Profil oder den Bearbeiten-Button eines Arztes
3. Weisen Sie seinen Empfehlungscode zu oder ändern Sie ihn

Empfehlungscodes folgen dem Format: `DR[NACHNAME]` (z.B. `DRMUELLER`)

---

## 8. Sicherheits-Best-Practices

### Kontosicherheit

- **Starke Passwörter verwenden**: Mindestens 12 Zeichen mit Groß-/Kleinschreibung, Zahlen und Symbolen
- **Regelmäßige Passwortrotation**: Admin-Passwörter alle 90 Tage ändern
- **Sicherer Zugang**: Admin-Dashboard nur von vertrauenswürdigen Netzwerken aufrufen

### Datenschutz

- **DSGVO-Konformität**: Patientendaten sind nach österreichischem und EU-Recht geschützt
- **Audit-Trail**: Alle Admin-Aktionen werden zur Nachverfolgung protokolliert
- **Minimaler Zugang**: Admin-Zugang nur an Personal vergeben, das ihn benötigt

### Umgang mit sensiblen Daten

- Niemals Admin-Zugangsdaten teilen
- Keine Patientendaten ohne ordnungsgemäße Genehmigung exportieren
- Verdächtige Aktivitäten sofort melden

---

## 9. Fehlerbehebung

### Häufige Probleme

#### Arzt kann sich nicht anmelden

1. Überprüfen Sie, ob das Konto **Aktiv** ist (nicht deaktiviert)
2. Prüfen Sie, ob die E-Mail-Adresse korrekt ist
3. Versuchen Sie, das Passwort zurückzusetzen

#### Preise werden nicht aktualisiert

1. Stellen Sie sicher, dass Änderungen gespeichert wurden (auf Bestätigungsmeldung achten)
2. Browser-Cache leeren und aktualisieren
3. Prüfen Sie, ob individuelle Arztpreise die globalen Einstellungen überschreiben

#### Patient erhält keine Antworten

1. Prüfen Sie den Konsultationsstatus im System
2. Überprüfen Sie, ob ein Arzt den Fall übernommen hat
3. Bestätigen Sie, dass das Arztkonto aktiv ist

### Hilfe erhalten

Für technische Probleme, die über dieses Handbuch hinausgehen:

1. Überprüfen Sie die technische Dokumentation in `docs/technical/`
2. Prüfen Sie Systemprotokolle auf Fehlerdetails
3. Kontaktieren Sie das Entwicklungsteam

---

## Kurzreferenz

### Admin-Dashboard-URLs

| Seite | URL |
|-------|-----|
| Admin-Login | `/auth/admin` |
| Admin-Dashboard | `/admin/dashboard` |

### Tastaturkürzel

| Aktion | Kürzel |
|--------|--------|
| Daten aktualisieren | `Strg + R` / `Cmd + R` |
| Suchen | `Strg + F` / `Cmd + F` |

---

*Zuletzt aktualisiert: Februar 2026*
