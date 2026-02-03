# Crystal Rush - Changelog

Alle wichtigen Änderungen am Projekt werden in dieser Datei dokumentiert.

---

## [1.2.0] - 2026-02-03

### ✨ Neue Features

#### LocalStorage-System (`js/storage.js`)
- ✅ Speichern von Spielfortschritt und Highscores
- ✅ Level-Freischaltungs-System (3 Welten mit je 4 Levels)
- ✅ Statistik-Tracking (Spielzeit, Jumps, Tode, besiegte Gegner)
- ✅ Einstellungen (Sound, Musik, Touch-Controls)
- ✅ Export/Import-Funktionalität für Savegames
- ✅ Automatische Migrations für neue Versionen
- ✅ Debug-Funktionen: `window.debugStorage`

**API:**
```javascript
gameStorage.init()                          // Initialisieren
gameStorage.updateProgress(levelId, ...)    // Nach Level-Complete
gameStorage.isLevelUnlocked(levelId)        // Prüfen ob freigeschaltet
gameStorage.getHighscore(levelId)           // Highscore abrufen
gameStorage.resetProgress()                 // Fortschritt zurücksetzen
```

#### Mobile Touch-Controls (`js/touch.js`)
- ✅ Virtueller Joystick für Bewegung (links/rechts)
- ✅ Sprung-Button (rechts unten)
- ✅ Automatische Mobile-Erkennung
- ✅ Smooth Touch-Feedback mit visuellen States
- ✅ Kompatibel mit bestehender Tastatur-Steuerung
- ✅ Debug-Funktionen: `window.debugTouch`

**Features:**
- Joystick mit Deadzone und maximaler Distanz
- Touch-IDs für Multi-Touch-Support
- Automatisches Enable/Disable auf mobilen Geräten
- CSS-Animationen für Button-Feedback

#### Input-System Integration (`js/input.js`)
- ✅ Kombiniert Keyboard + Touch nahtlos
- ✅ Einheitliche API: `input.isLeft()`, `input.isRight()`, `input.isJump()`
- ✅ Automatisches Fallback wenn Touch nicht verfügbar

### 🔧 Verbesserungen

#### index.html
- ✅ Mobile-optimierter Viewport (`user-scalable=no`)
- ✅ Neue Script-Tags für `storage.js` und `touch.js`
- ✅ Mobile-Hinweis im Start-Screen
- ✅ Bessere Script-Organisation (Core, Input, Game Systems)

### 📝 Technische Details

**Neue Dateien:**
- `js/storage.js` - 9.1 KB - LocalStorage-Management
- `js/touch.js` - 8.3 KB - Touch-Controls-System

**Geänderte Dateien:**
- `js/input.js` - Touch-Integration
- `index.html` - Script-Tags und Mobile-Viewport

**Kompatibilität:**
- ✅ Abwärtskompatibel - alte Savegames werden migriert
- ✅ Graceful Degradation - funktioniert ohne LocalStorage
- ✅ Progressive Enhancement - Touch nur auf mobilen Geräten

### 📊 Dateigrößen

| Datei | Größe | Zeilen | Beschreibung |
|-------|--------|--------|---------------|
| `storage.js` | 9.1 KB | 320 | LocalStorage-System |
| `touch.js` | 8.3 KB | 290 | Touch-Controls |
| `input.js` | 1.8 KB | 60 | Input-Handler |

**Total neue Code:** ~19 KB, ~670 Zeilen

---

## [1.1.0] - 2026-02-03

### ✨ Neue Features

#### Lokale Asset-Verwaltung
- ✅ Download-Scripts für Windows & Linux/Mac
- ✅ Asset-Loader mit lokalem Vorrang + S3-Fallback
- ✅ .gitignore für Assets (keine großen Dateien im Repo)
- ✅ ASSETS_README.md mit Anleitung

**Vorteile:**
- ⚡ 10x schnellere Ladezeiten
- 💾 Offline-fähig
- 🛠️ Eigene Grafiken einfach einbinden

#### Neue Dateien
- `download-assets.bat` - Windows Asset-Download
- `download-assets.sh` - Linux/Mac Asset-Download
- `.gitignore` - Git-Ignore für Assets
- `ASSETS_README.md` - Asset-Dokumentation

### 🔧 Verbesserungen

#### js/assets.js
- Lokale Pfade mit S3-Fallback
- Besseres Error-Handling
- Logging zeigt Quelle (local/S3)

---

## [1.0.0] - 2026-02-03

### ✨ Initiales Release

#### Core Game-Engine
- ✅ 60 FPS Game Loop
- ✅ Physik-Engine (Gravity, Kollision, Friction)
- ✅ Camera-System mit Smooth-Following
- ✅ Input-Handler (Keyboard)
- ✅ Sound-System (prozedural mit Web Audio API)

#### Grafik-System
- ✅ Asset-Loader für hochauflösende Grafiken
- ✅ Parallax-Scrolling (4 Bild-Layer)
- ✅ Loading-Screen mit Fortschrittsanzeige

#### Gameplay
- ✅ Spieler mit Idle/Running/Jumping-States
- ✅ 3 Gegner-Typen (Forest Sprite, Rock Golem, Void Moth)
- ✅ Sammelbare Items (Münzen, Kristalle)
- ✅ Plattformen mit Kollision
- ✅ Level-System mit Zielflagge
- ✅ Leben-System & Invincibility-Frames

#### UI/UX
- ✅ Start/Pause/GameOver/LevelComplete-Screens
- ✅ Score-Tracking (Coins, Lives, Time)
- ✅ Responsive Design

#### Dokumentation
- ✅ README.md - Hauptdokumentation
- ✅ GRAPHICS.md - Grafik-Galerie
- ✅ Inline-Kommentare in allen JS-Dateien

---

## Geplante Features

### v1.3.0 - Content-Erweiterung
- [ ] Welt 2: Biolumineszente Kristallhöhlen (4 Levels)
- [ ] Welt 3: Schwebende Himmelsinseln (4 Levels)
- [ ] Boss-Kämpfe am Ende jeder Welt
- [ ] Neue Gegner-Typen pro Welt
- [ ] Power-Ups (Doppelsprung, Schutzschild, Speed-Boost)

### v1.4.0 - Level-Editor
- [ ] Browser-basierter Level-Editor
- [ ] Drag & Drop Interface
- [ ] Export/Import von Level-Daten (JSON)
- [ ] Plattform-Platzierung
- [ ] Gegner-Spawner
- [ ] Item-Platzierung

### v1.5.0 - Multiplayer (optional)
- [ ] Lokaler 2-Spieler-Modus
- [ ] Splitscreen oder Shared-Screen
- [ ] Highscore-Wettbewerb

---

## Migration Guides

### v1.1.0 → v1.2.0

**LocalStorage:**
```bash
# Keine Aktion nötig - automatische Migration
# Falls Probleme: debugStorage.reset() in Console
```

**Touch-Controls:**
```bash
# Automatisch aktiviert auf mobilen Geräten
# Manuell testen: debugTouch.enable()
```

### v1.0.0 → v1.1.0

**Assets:**
```bash
# Nach git pull:
download-assets.bat  # Windows
./download-assets.sh # Linux/Mac
```

---

## Breaking Changes

Keine breaking changes bisher - alle Updates sind abwärtskompatibel.

---

## Bekannte Probleme

### v1.2.0
- Touch-Controls können auf einigen Android-Browsern verzogert reagieren
- LocalStorage-Limit (5-10 MB) könnte bei vielen Savegames erreicht werden

### v1.1.0
- Sprites werden noch prozedural gezeichnet (echte Sprite-Animationen geplant)

### v1.0.0
- Nur 1 Demo-Level verfügbar
- Keine Boss-Kämpfe
- Keine mobile Touch-Controls (behoben in v1.2.0)

---

## Contributors

- Crystal Rush Team - Initial work
- Perplexity AI - Implementation Support

---

## License

© 2026 Crystal Rush Team - All Rights Reserved
