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
- ✅ Professionelle Vektorgrafiken statt prozeduraler Shapes
- ✅ Smooth Gradients und moderne Farben
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

## 📦 Installation

### Mit XAMPP:

1. **Repository klonen:**
```bash
cd C:\xampp\htdocs
git clone https://github.com/jayjay079/game.git
```

2. **Apache starten** in XAMPP Control Panel

3. **Browser öffnen:**
```
http://localhost/game
```

4. **Grafiken werden automatisch geladen!** 🎉

---

## 📸 Grafik-Assets

Alle hochauflösenden Grafiken werden automatisch beim Start geladen:

### Sprite Sheets:
- ✅ **Character** - Idle, Running, Jumping, Damage Animationen
- ✅ **Enemies** - Forest Sprite, Rock Golem, Void Moth
- ✅ **Items** - Münzen, Kristalle, Zielflagge
- ✅ **Tileset** - Plattformen & Dekorations-Elemente

### Parallax Backgrounds:
- ✅ **Mountains** - Entfernte lila Berge
- ✅ **Hills** - Grüne Hügel in mehreren Ebenen
- ✅ **Clouds** - Fluffy weiße Wolken
- ✅ **Trees** - Bäume und Vegetation

👉 Alle Grafiken ansehen: [GRAPHICS.md](GRAPHICS.md)

---

## 🛠️ Technologie

- **HTML5 Canvas** für Rendering
- **Vanilla JavaScript** (ES6+)
- **Asset Loader System** für Grafiken
- **Web Audio API** für Sound
- **RequestAnimationFrame** für 60 FPS Loop
- **Modulare Architektur**

## 📁 Projektstruktur

```
game/
├── index.html          # Hauptseite mit Loading Screen
├── css/
│   └── style.css       # Styling + Loading Bar
├── js/
│   ├── main.js         # Entry Point mit Asset Loading
│   ├── assets.js       # ✨ NEU: Asset Loader System
│   ├── game.js         # Game Loop & Manager
│   ├── player.js       # Spieler-Logik
│   ├── enemies.js      # 3 Gegner-Typen
│   ├── entities.js     # Plattformen, Münzen, Kristalle
│   ├── level.js        # Level-System
│   ├── physics.js      # Physik-Engine
│   ├── parallax.js     # ✨ Parallax mit Bild-Support
│   ├── input.js        # Tastatur-Handler
│   ├── sound.js        # Sound-System
│   └── utils.js        # Hilfsfunktionen
├── GRAPHICS.md         # ✨ Grafik-Galerie
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

### Aktueller Stand: v1.0.0
- ✅ Vollständige Game-Engine
- ✅ Hochauflösende Grafiken integriert
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

## 🐛 Bekannte Probleme

- Sprites werden noch prozedural gezeichnet (Integration geplant)
- Nur 1 Demo-Level verfügbar
- Keine Mobile-Controls

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

Bei Fragen oder Feedback: [GitHub Issues](https://github.com/jayjay079/game/issues)