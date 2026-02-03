# Crystal Rush 🎮

Ein modernes 2D Jump & Run Spiel im Browser mit hochauflösenden Grafiken und flüssigem Parallax-Scrolling.

## Features

✨ **Gameplay**
- Flüssiges 60 FPS Gameplay
- Präzise Sprung-Mechanik mit variabler Höhe
- 3 einzigartige Welten mit je 4 Levels
- Verschiedene Gegnertypen mit eigenen Verhaltensweisen
- Münzen und Kristalle zum Sammeln
- Power-Up System

🎨 **Grafik**
- Hochauflösende Vektorgrafiken
- 5-7 Layer Parallax-Scrolling für Tiefenwirkung
- Dynamische Partikeleffekte
- Smooth Gradients und moderne Farbverläufe

🎵 **Sound**
- Prozedurales Sound-System mit Web Audio API
- Hintergrundmusik
- Sound-Effekte für alle Aktionen

🎮 **Steuerung**
- ← → oder A D: Bewegung
- Leertaste oder W: Springen
- ESC: Pause

## Installation

1. Repository klonen:
```bash
git clone https://github.com/jayjay079/game.git
```

2. Mit XAMPP starten:
   - Repository in `htdocs` Ordner kopieren
   - Apache starten
   - Browser öffnen: `http://localhost/game`

## Technologie

- **HTML5 Canvas** für Rendering
- **Vanilla JavaScript** (ES6+)
- **Web Audio API** für Sound
- **RequestAnimationFrame** für Animations-Loop
- **Modulare Architektur** für einfache Erweiterbarkeit

## Projektstruktur

```
game/
├── index.html          # Hauptseite
├── css/
│   └── style.css       # Styling
├── js/
│   ├── main.js         # Entry Point
│   ├── game.js         # Game Loop & Manager
│   ├── player.js       # Spieler-Logik
│   ├── enemies.js      # Gegner-Klassen
│   ├── entities.js     # Basis-Entities (Plattformen, Items)
│   ├── level.js        # Level-Management
│   ├── physics.js      # Physik-Engine
│   ├── parallax.js     # Parallax-System
│   ├── input.js        # Input-Handler
│   ├── sound.js        # Sound-System
│   └── utils.js        # Hilfsfunktionen
└── README.md
```

## Entwicklung

### Nächste Schritte:
- [ ] Sprite-Sheets für Animationen
- [ ] Weitere Level hinzufügen
- [ ] Boss-Kämpfe implementieren
- [ ] Mobile Touch-Controls
- [ ] Highscore-System mit LocalStorage
- [ ] Level-Editor

## Credits

Entwickelt für Crystal Rush Adventures
© 2026 Crystal Rush Team

---

**Viel Spaß beim Spielen! 🎮✨**