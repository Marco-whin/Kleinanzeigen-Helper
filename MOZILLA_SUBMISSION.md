# Mozilla Add-ons Einreichung - Anleitung

## ✅ Behobene Probleme

Alle von Mozilla gemeldeten Probleme wurden behoben:

### 1. ✅ Manifest Version aktualisiert
- `strict_min_version` von 57.0 auf 79.0 erhöht
- Behebt die Warnung bezüglich `browser_action.default_icon`

### 2. ✅ Eindeutige Extension-ID
- UUID-basierte ID: `{65948786-0004-4c8b-a7a0-9cc5619f0bde}`
- Stabil für zukünftige Updates

### 3. ✅ Sicherer Code (kein innerHTML)
- Alle `innerHTML`-Verwendungen durch sichere DOM-Manipulation ersetzt
- Verwendet nur `textContent` und `createElement`
- Keine XSS-Risiken mehr

## 📋 Für die Einreichung bei Mozilla

### Erforderliche Informationen:

**Name:** Kleinanzeigen Helper

**Kurzbeschreibung (max 132 Zeichen):**
Schnelle Antwortvorlagen und Anzeigen-Filter für kleinanzeigen.de. Spare Zeit beim Kaufen und Verkaufen!

**Vollständige Beschreibung:**
```
Kleinanzeigen Helper macht das Kaufen und Verkaufen auf kleinanzeigen.de schneller und komfortabler.

FUNKTIONEN:
• Antwortvorlagen: Erstelle vorgefertigte Nachrichten und füge sie mit einem Klick ein
• Vorlagen bearbeiten: Verwalte deine Vorlagen in einer übersichtlichen Einstellungsseite
• Anzeigen ausblenden: Blende uninteressante Anzeigen mit einem Klick aus
• Rückgängig-Funktion: 5 Sekunden Zeit zum Rückgängig machen beim Ausblenden
• Individuelle Einstellungen: Schalte Features nach Belieben an oder aus

DATENSCHUTZ:
• Alle Daten werden nur lokal in deinem Browser gespeichert
• Keine Datenübertragung an externe Server
• Open Source - du kannst den Code einsehen

VERWENDUNG:
Die Extension funktioniert automatisch auf kleinanzeigen.de. Klicke auf das Extension-Icon, um deine Vorlagen zu verwalten und Einstellungen anzupassen.

Perfekt für Vielkäufer und -verkäufer, die Zeit sparen möchten!
```

**Kategorie:** Shopping & Utilities

**Tags (Stichwörter):**
- kleinanzeigen
- shopping
- templates
- messaging
- productivity
- ebay-kleinanzeigen

**Version:** 1.0

**Lizenz:** MIT License (oder Custom License)

**Support-Website:** (Deine GitHub-Seite oder Email)

**Datenschutzrichtlinie:** 
```
Diese Extension sammelt keine persönlichen Daten.
Alle Vorlagen und Einstellungen werden ausschließlich lokal im Browser gespeichert.
Es werden keine Daten an externe Server übertragen.
```

## 🎯 Screenshots vorbereiten

Mozilla verlangt mindestens 1 Screenshot (max 5). Empfohlene Größe: 1280x800px

**Vorgeschlagene Screenshots:**
1. Einstellungsseite mit Vorlagen-Verwaltung
2. Anzeigenseite mit Vorlagen-Buttons unter dem Textfeld
3. Ausblenden-Button bei Anzeigen
4. Rückgängig-Benachrichtigung

## 📤 Einreichungsprozess

1. **Gehe zu:** https://addons.mozilla.org/developers/
2. **Klicke:** "Submit a New Add-on"
3. **Lade hoch:** Die ZIP-Datei
4. **Wähle:** "On this site" (selbst hosten) ODER "On Firefox Add-ons" (von Mozilla hosten)
5. **Fülle aus:** Alle Metadaten (siehe oben)
6. **Lade hoch:** Screenshots
7. **Warte:** Mozilla Review (dauert 1-7 Tage)

## ⏱️ Review-Prozess

- **Automatische Prüfung:** Sofort (prüft Malware, bekannte Probleme)
- **Manuelle Prüfung:** 1-7 Tage (ein Mensch schaut sich den Code an)
- **Bei Ablehnung:** Du bekommst Feedback, was zu ändern ist

## 🔄 Updates einreichen

Für zukünftige Updates:
1. Version-Nummer in `manifest.json` erhöhen (z.B. 1.1, 1.2)
2. Neue ZIP erstellen
3. In deinem Developer-Dashboard → "Upload New Version"

## 💡 Tipps

- Sei ehrlich und transparent in der Beschreibung
- Erkläre klar, welche Berechtigungen du brauchst und warum
- Antworte schnell auf Reviewer-Fragen
- Die erste Einreichung dauert am längsten

---

Viel Erfolg bei der Einreichung! 🚀
