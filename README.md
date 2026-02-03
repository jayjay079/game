# Crystal Rush 🎮

Ein modernes 2D Jump & Run Spiel im Browser mit **hochauflösenden Grafiken** und flüssigem Parallax-Scrolling.

## ✨ Features

### Gameplay
- ✅ Flüssiges 60 FPS Gameplay
- ✅ Präzise Sprung-Mechanik mit variabler Höhe
- ✅ 3 einzigartige Welten (Demo: Welt 1 - Goldene Wiesen)
- ✅ 3 verschiedene Gegnertypen mit eigenen Verhaltensweisen
- ✅ Münzen und Kristalle zum Sammeln
- ✅ Power-Up System
- ✅ Leben-System & Score-Tracking

### 🎨 Grafik (NEU!)
- ✅ **Hochauflösende Sprite-Sheets** für Charakter, Gegner & Items
- ✅ **Echte Parallax-Backgrounds** mit 4 Bild-Layern
- ✅ **Lokale Assets** mit automatischem S3-Fallback
- ✅ Professionelle Vektorgrafiken statt prozeduraler Shapes
- ✅ Loading Screen mit Fortschrittsanzeige

### 🎵 Sound
- ✅ Prozedurales Sound-System mit Web Audio API
- ✅ Hintergrundmusik-Loop
- ✅ Sound-Effekte für alle Aktionen

### 🎮 Steuerung
- **← →** oder **A D**: Bewegung
- **Leertaste** oder **W**: Springen (gedrückt halten = höher!)
- **ESC**: Pause

---

## 📦 Installation & Setup

### Schritt 1: Repository klonen

```bash
cd C:\xampp\htdocs
git clone https://github.com/jayjay079/game.git
cd game
```

### Schritt 2: Assets herunterladen (WICHTIG!) ⚡

Grafiken werden **lokal** gespeichert für schnellere Ladezeiten:

#### Windows:
```bash
# Doppelklick auf:
download-assets.bat
```

#### Linux/Mac:
```bash
chmod +x download-assets.sh
./download-assets.sh
```

**Was passiert:**
- Lädt 8 Grafiken (~7 MB) in `assets/` Ordner
- Zeigt Fortschritt für jede Datei
- Dauert ca. 10-30 Sekunden

### Schritt 3: Spiel starten

1. **Apache starten** in XAMPP Control Panel
2. **Browser öffnen:** `http://localhost/game`
3. **Spielen!** 🎮

---

## 💾 Lokale vs. S3 Assets

### ⚡ Lokale Assets (Empfohlen)

**Vorteile:**
- 🚀 **10x schneller** - Keine Internet-Latenz
- 💾 **Offline-fähig** - Spiel funktioniert ohne Internet
- 🛠️ **Anpassbar** - Eigene Grafiken einfach austauschen

**Setup:** Einmalig `download-assets.bat` ausführen

### ☁️ S3 Fallback (Automatisch)

Falls lokale Dateien fehlen:
- ✅ Lädt automatisch von S3
- ✅ Keine Fehlermeldungen
- ⚠️ Langsamer (2-8 Sekunden Ladezeit)

**Du musst nichts tun** - das System entscheidet automatisch!

👉 Mehr Infos: [ASSETS_README.md](ASSETS_README.md)

---

## 📸 Grafik-Assets

Alle hochauflösenden Grafiken:

### Sprite Sheets:
- ✅ **Character** - Idle, Running, Jumping, Damage Animationen
- ✅ **Enemies** - Forest Sprite, Rock Golem, Void Moth
- ✅ **Items** - Münzen, Kristalle, Zielflagge
- ✅ **Tileset** - Plattformen & Dekorations-Elemente

### Parallax Backgrounds:
- ✅ **Mountains** - Entfernte lila Berge (Scroll Speed: 0.1)
- ✅ **Hills** - Grüne Hügel (Scroll Speed: 0.3)
- ✅ **Clouds** - Fluffy weiße Wolken (Scroll Speed: 0.2)
- ✅ **Trees** - Bäume & Vegetation (Scroll Speed: 0.7)

👉 Grafiken ansehen: [GRAPHICS.md](GRAPHICS.md)

---

## 🛠️ Technologie

- **HTML5 Canvas** für Rendering
- **Vanilla JavaScript** (ES6+)
- **Asset Loader System** mit lokalen Pfaden + S3 Fallback
- **Web Audio API** für Sound
- **RequestAnimationFrame** für 60 FPS Loop
- **Modulare Architektur**

## 📁 Projektstruktur

```
game/
├── assets/                 # ⚡ Lokale Grafiken (nach Download)
│   ├── sprites/
│   │   ├── character.png
│   │   ├── enemies.png
│   │   ├── items.png
│   │   └── tileset.png
│   └── backgrounds/
│       ├── mountains.png
│       ├── hills.png
│       ├── clouds.png
│       └── trees.png
├── index.html
├── download-assets.bat    # ⚡ Windows Asset Download
├── download-assets.sh     # ⚡ Linux/Mac Asset Download
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── assets.js          # ⚡ Asset Loader (lokal + S3)
│   ├── game.js
│   ├── player.js
│   ├── enemies.js
│   ├── entities.js
│   ├── level.js
│   ├── physics.js
│   ├── parallax.js
│   ├── input.js
│   ├── sound.js
│   └── utils.js
├── GRAPHICS.md            # 🎨 Grafik-Galerie
├── ASSETS_README.md       # 💾 Asset-Verwaltung
└── README.md
```

---

## 🎮 Spielanleitung

1. **Starte das Spiel** - Warte bis Grafiken geladen sind (0-100%)
2. **Klicke "Start Game"**
3. **Sammle Münzen** 💎 für Punkte (100 = Extra-Leben!)
4. **Sammle Kristalle** ✨ für Bonus-Punkte
5. **Besiege Gegner** durch Draufspringen
6. **Erreiche die Zielflagge** am Ende des Levels

### Gegner-Strategie:
- **Wald-Sprite** (🌿) - Schwebt langsam, einfach zu besiegen
- **Stein-Golem** (🪨) - Langsam aber 2 HP!
- **Void-Motte** (🦋) - Fliegt in Wellenmustern, timing wichtig

---

## 🚀 Entwicklung

### Aktueller Stand: v1.1.0
- ✅ Vollständige Game-Engine
- ✅ Hochauflösende Grafiken integriert
- ✅ **Lokale Assets mit S3-Fallback** ⚡
- ✅ Parallax-Scrolling mit echten Bildern
- ✅ Asset-Loading-System
- ✅ Demo-Level (Welt 1)
- ✅ 3 Gegnertypen
- ✅ Sound-System

### Nächste Schritte:
- [ ] Animierte Sprites für Charakter & Gegner
- [ ] Weitere Level für Welt 1
- [ ] Welt 2: Biolumineszente Kristallhöhlen
- [ ] Welt 3: Schwebende Himmelsinseln
- [ ] Boss-Kämpfe
- [ ] Mobile Touch-Controls
- [ ] Highscore mit LocalStorage

---

## 🐛 Troubleshooting

### Problem: Grafiken laden langsam

**Lösung:**
```bash
# Assets lokal herunterladen:
download-assets.bat  # Windows
./download-assets.sh # Linux/Mac
```

### Problem: "Failed to load assets"

**Lösung:**
1. Prüfe Internet-Verbindung (für S3-Fallback)
2. Nutze XAMPP statt direktes Öffnen (CORS!)
3. Browser-Cache leeren (Strg + F5)

### Problem: Assets im falschen Verzeichnis

**Lösung:**
```bash
# Verzeichnisstruktur prüfen:
dir assets\sprites      # Windows
ls -l assets/sprites    # Linux/Mac

# Sollte enthalten:
# character.png, enemies.png, items.png, tileset.png
```

👉 Mehr Lösungen: [ASSETS_README.md](ASSETS_README.md)

---

## 📝 Credits

**Entwickelt für Crystal Rush Adventures**

- Game Engine: Custom JavaScript
- Grafiken: Hochauflösende KI-generierte Assets
- Sound: Prozedurales Web Audio API System
- Level Design: Hand-crafted

© 2026 Crystal Rush Team

---

## ❤️ Danke fürs Spielen!

**Viel Spaß beim Sammeln, Springen und Erkunden! 🎮✨**

### Weitere Dokumentation:
- 🎨 [Grafik-Galerie](GRAPHICS.md) - Alle Assets ansehen
- 💾 [Asset-Verwaltung](ASSETS_README.md) - Lokale Grafiken verwalten
- 🐛 [GitHub Issues](https://github.com/jayjay079/game/issues) - Bugs melden

---

**Quick Start:**
```bash
git clone https://github.com/jayjay079/game.git
cd game
download-assets.bat  # Assets herunterladen
# Starte XAMPP Apache
# Öffne: http://localhost/game
```
