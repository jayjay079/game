# 💾 Crystal Rush - Lokale Assets

## 📦 Assets herunterladen

Die Grafiken werden **nicht im Git-Repository gespeichert** (zu groß, ~7 MB). Stattdessen werden sie automatisch von deinem lokalen Server geladen.

### Option 1: Automatischer Download (Empfohlen) ⚡

#### Windows:
```bash
cd C:\xampp\htdocs\game
git pull origin main
double-click auf: download-assets.bat
```

#### Linux/Mac:
```bash
cd /path/to/game
git pull origin main
chmod +x download-assets.sh
./download-assets.sh
```

### Option 2: Manueller Download

Falls die Scripts nicht funktionieren:

```bash
# Verzeichnisse erstellen
mkdir -p assets/sprites assets/backgrounds

# Character
curl -L -o assets/sprites/character.png "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/fa44d568-0299-47bd-ae9a-df62953fcc7d.png"

# Enemies
curl -L -o assets/sprites/enemies.png "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/bf3bf5c5-b432-4cf5-98a0-3ec2177ddc58.png"

# Items
curl -L -o assets/sprites/items.png "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/1523642d-8b01-4138-b6f1-4d6a67778974.png"

# Tileset
curl -L -o assets/sprites/tileset.png "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/f0b5fa87-097c-4351-af8b-f8ce910af243.png"

# Mountains
curl -L -o assets/backgrounds/mountains.png "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/772c6f02-d4ed-4230-9ce5-d0a0170acd7c.png"

# Hills
curl -L -o assets/backgrounds/hills.png "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4559f7a6-be83-4e06-93c3-fe20966985b9.png"

# Clouds
curl -L -o assets/backgrounds/clouds.png "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/5d729062-9767-4c3f-9084-3b09f7c55d8b.png"

# Trees
curl -L -o assets/backgrounds/trees.png "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/59e53348-3c06-4a27-b894-627d7cee7863.png"
```

---

## 📝 Verzeichnisstruktur

Nach dem Download:

```
game/
├── assets/
│   ├── sprites/
│   │   ├── character.png      (~600 KB)
│   │   ├── enemies.png        (~500 KB)
│   │   ├── items.png          (~400 KB)
│   │   └── tileset.png        (~800 KB)
│   └── backgrounds/
│       ├── mountains.png      (~1.2 MB)
│       ├── hills.png          (~1.2 MB)
│       ├── clouds.png         (~1.2 MB)
│       └── trees.png          (~1.2 MB)
├── js/
├── css/
└── index.html
```

**Total:** ~7.1 MB

---

## ⚙️ Wie es funktioniert

### Automatischer Fallback

Das Spiel versucht **zuerst lokale Assets** zu laden:

1. **Lokal:** `assets/sprites/character.png`
2. **Fallback:** S3 URL (falls lokal nicht gefunden)

**Vorteile:**
- ⚡ **Schneller:** Kein Internet-Download beim Spielen
- 💾 **Offline-fähig:** Spiel funktioniert ohne Internet
- 🛠️ **Flexibel:** Kannst eigene Grafiken verwenden

### S3-Only Mode

Falls du **keine lokalen Assets** willst:

```javascript
// In Browser Console (F12):
assetLoader.setLocalMode(false);
```

Oder in `js/assets.js` ändern:
```javascript
this.useLocalAssets = false; // Zeile 6
```

---

## ✅ Überprüfung

### Nach dem Download prüfen:

```bash
# Windows
dir assets\sprites
dir assets\backgrounds

# Linux/Mac
ls -lh assets/sprites
ls -lh assets/backgrounds
```

### Erwartete Ausgabe:
```
character.png   ~600 KB
enemies.png     ~500 KB
items.png       ~400 KB
tileset.png     ~800 KB
mountains.png   ~1.2 MB
hills.png       ~1.2 MB
clouds.png      ~1.2 MB
trees.png       ~1.2 MB
```

### Im Spiel prüfen:

1. Starte: `http://localhost/game`
2. Öffne Console (F12)
3. Suche nach:
   ```
   ✓ Loaded: character from local (1/8)
   ✓ Loaded: enemies from local (2/8)
   ...
   ```

Falls "from S3" statt "from local" → Assets nicht gefunden, Download wiederholen!

---

## 🔧 Eigene Grafiken verwenden

### 1. Ersetze PNG-Dateien

Einfach deine eigenen PNG-Dateien mit den gleichen Namen speichern:

```bash
# Beispiel: Eigener Character
cp mein-character.png assets/sprites/character.png
```

### 2. Achte auf Format:

- **Format:** PNG mit Transparenz (32-bit RGBA)
- **Character:** Sprite Sheet Grid 4×6, ~100×100px pro Frame
- **Enemies:** Sprite Sheet Grid 3×6, ~80×80px pro Frame
- **Backgrounds:** Nahtlos kachelbar, 2048px breit

### 3. Hard-Refresh

```bash
Strg + F5  # Browser-Cache leeren
```

---

## 🧹 Assets löschen

```bash
# Alle Assets entfernen
rm -rf assets/

# Oder nur Sprites
rm -rf assets/sprites/
```

Das Spiel fällt automatisch auf S3 zurück!

---

## 🐞 Troubleshooting

### Problem: "Failed to load from both sources"

**Lösung:**
1. Prüfe Internet-Verbindung
2. Führe Download-Script nochmal aus
3. Prüfe Dateigrößen (sollten >100 KB sein)

### Problem: CORS Error

**Lösung:**
- Nutze **XAMPP** statt direktes Öffnen der HTML-Datei
- Local Server ist zwingend nötig!

### Problem: Script-Fehler auf Windows

**Lösung:**
```bash
# Falls .bat nicht funktioniert:
# 1. Installiere Git Bash
# 2. Nutze .sh Script stattdessen
bash download-assets.sh
```

---

## 📊 Performance

### Vergleich: Lokal vs S3

| Metrik | Lokal | S3 |
|--------|-------|----|
| **Ladezeit** | 0.5-1s | 2-8s |
| **Internet nötig** | ❌ Nein | ✅ Ja |
| **Cache** | Immer frisch | Browser-abhängig |
| **Bandbreite** | 0 MB | 7 MB |

**Empfehlung:** Lokale Assets für Entwicklung & Tests!

---

## 📝 Zusammenfassung

**Einmalig ausführen:**
```bash
# Windows
double-click: download-assets.bat

# Linux/Mac
./download-assets.sh
```

**Danach:**
- ⚡ Spiel lädt Assets lokal
- 💾 Funktioniert offline
- 🚀 Schnellere Ladezeiten

**Bei Problemen:** Assets werden automatisch von S3 geladen!

---

**🎮 Viel Spaß mit Crystal Rush!**

[Zurück zum Hauptmenü](README.md) | [Grafik-Galerie ansehen](GRAPHICS.md)
