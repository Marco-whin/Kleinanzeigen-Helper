# Kleinanzeigen Helper - Firefox Extension (v2.0)

Eine praktische Browser-Extension für Kleinanzeigen.de, die dir hilft, schneller zu kommunizieren und Anzeigen zu verwalten.

## 🎯 Features

- **📝 Antwortvorlagen**: Erstelle und verwende vorgefertigte Nachrichtentexte
- **✏️ Vorlagen bearbeiten**: Eigene Einstellungsseite zum Verwalten deiner Vorlagen
- **👁️ Anzeigen ausblenden**: Blende uninteressante Anzeigen aus (kleiner, unauffälliger Button)
- **↩️ Rückgängig machen**: 5 Sekunden Zeit zum Rückgängig machen nach dem Ausblenden
- **⚡ Schnelle Kommunikation**: Ein Klick genügt, um Standardnachrichten einzufügen
- **💾 Synchronisierung**: Deine Vorlagen werden in deinem Browser gespeichert

## 📦 Installation in Firefox

1. **Firefox öffnen** und `about:debugging` in die Adresszeile eingeben
2. **"Dieser Firefox"** anklicken (links im Menü)
3. **"Temporäres Add-on laden..."** klicken
4. **Wähle die ZIP-Datei** direkt aus (oder entpacke sie und wähle manifest.json)
5. **Fertig!** Die Extension ist geladen

⚠️ **WICHTIG**: Temporäre Add-ons werden beim Neustart von Firefox entfernt!

## 🚀 Verwendung

### Vorlagen verwalten

1. **Klicke auf das Extension-Icon** in deiner Browser-Toolbar
2. **"Vorlagen verwalten"** klicken → Öffnet die Einstellungsseite
3. Dort kannst du:
   - Neue Vorlagen erstellen
   - Bestehende Vorlagen bearbeiten (✏️ Button)
   - Vorlagen löschen (🗑️ Button)
   - Ausgeblendete Anzeigen zurücksetzen
   - **Einstellungen anpassen** (Features an/aus schalten)

### Vorlagen verwenden

**Auf Kleinanzeigen.de:**
- Gehe zu einer Anzeige
- Öffne das Nachrichtenfeld
- Du siehst Buttons mit deinen Vorlagen unter dem Textfeld
- Klick auf einen Button → Text wird eingefügt

**Im Chatverlauf:**
- Wenn du mit jemandem bereits schreibst
- Buttons erscheinen auch dort automatisch
- Nutze sie für schnelle Antworten

### Anzeigen ausblenden

- **Kleiner ✕ Button** oben rechts bei jeder Anzeige
- Fährt man drüber, wird er deutlicher sichtbar
- Nach dem Klick: **5 Sekunden Countdown** zum Rückgängig machen
- Button "Rückgängig" erscheint unten rechts
- Danach wird die Anzeige dauerhaft ausgeblendet

### Einstellungen anpassen

In der Einstellungsseite (Vorlagen verwalten) findest du unten einen **Einstellungen**-Bereich:

- **Ausblenden-Button anzeigen**: Schaltet den ✕ Button bei Anzeigen an/aus
- **Vorlagen-Buttons anzeigen**: Schaltet die Vorlagen-Buttons unter Nachrichtenfeldern an/aus
- **Rückgängig-Benachrichtigung anzeigen**: Schaltet den 5-Sekunden-Countdown beim Ausblenden an/aus

Änderungen werden sofort gespeichert und beim nächsten Laden der Seite aktiv.

## 📋 Standard-Vorlagen

Die Extension startet mit 4 Vorlagen:

1. **Verfügbarkeit**: "Hallo, ist der Artikel noch verfügbar?"
2. **Preis verhandeln**: "Hallo, ich interessiere mich für den Artikel. Wäre der Preis noch verhandelbar?"
3. **Abholung**: "Hallo, ich würde den Artikel gerne abholen. Wann wäre das möglich?"
4. **Versand**: "Hallo, würden Sie den Artikel auch versenden? Ich würde die Versandkosten übernehmen."

Du kannst alle Vorlagen beliebig anpassen!

## 🆕 Neu in Version 2.0

- ✅ **Eigene Einstellungsseite** mit übersichtlicher Verwaltung
- ✅ **Vorlagen bearbeiten** statt nur löschen und neu erstellen
- ✅ **Undo-Funktion** (5 Sekunden) beim Ausblenden
- ✅ **Kleinerer Ausblenden-Button** (weniger störend)
- ✅ **Verbesserte Benutzeroberfläche** mit modernem Design
- ✅ **Einstellungen**: Features an/aus schalten (Ausblenden-Button, Vorlagen-Buttons, Undo-Benachrichtigung)

## 🛠️ Technische Details

- **Manifest Version**: 2 (Firefox-kompatibel)
- **Browser API**: Verwendet `browser.*` API mit Fallback auf `chrome.*`
- **Berechtigungen**: 
  - `storage`: Zum Speichern von Vorlagen und ausgeblendeten Anzeigen
  - Host-Berechtigung nur für `https://www.kleinanzeigen.de/*`

## 💡 Tipps

- **Platzhalter nutzen**: Schreibe Vorlagen wie "Hallo, ich interessiere mich für [ARTIKEL]. Ist er noch verfügbar?"
- **Schnellzugriff**: Lege ein Lesezeichen für `about:debugging` an
- **Mehrere Vorlagen**: Erstelle verschiedene Vorlagen für unterschiedliche Situationen
- **Backup**: Notiere dir wichtige Vorlagen, da sie beim Deinstallieren verloren gehen

## 🐛 Probleme melden

Falls etwas nicht funktioniert:

1. Überprüfe, ob du auf kleinanzeigen.de bist
2. Lade die Seite neu (F5)
3. In `about:debugging` → Extension neu laden
4. Prüfe die Browser-Konsole (F12) auf Fehlermeldungen

## 📝 Bekannte Einschränkungen

- Extension muss nach jedem Firefox-Neustart neu geladen werden (Firefox-Limitierung für temporäre Add-ons)
- Kleinanzeigen könnte ihr Layout ändern, dann müssen die Selektoren angepasst werden

---

Viel Erfolg beim Kaufen und Verkaufen auf Kleinanzeigen! 🦊🎉
