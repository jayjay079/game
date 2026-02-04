# Sprite Sheet Analysis Tool

## Character.png Debug Helper

Um das **character.png** Sprite Sheet korrekt zu analysieren, öffne die Browser Console (F12) und führe diesen Code aus:

```javascript
// 1. Sprite Sheet laden und analysieren
const img = assetLoader.get('character');

if (img && img.complete) {
    console.log('=== CHARACTER.PNG ANALYSIS ===');
    console.log('Image Dimensions:', img.width, 'x', img.height);
    
    // Angenommene Frame-Größen testen
    const testFrameSizes = [50, 64, 80, 96, 100, 128, 150];
    
    testFrameSizes.forEach(frameSize => {
        const cols = Math.floor(img.width / frameSize);
        const rows = Math.floor(img.height / frameSize);
        const totalFrames = cols * rows;
        
        console.log(`\nFrame Size ${frameSize}x${frameSize}:`);
        console.log(`  Columns: ${cols}`);
        console.log(`  Rows: ${rows}`);
        console.log(`  Total Frames: ${totalFrames}`);
        console.log(`  Remaining Width: ${img.width % frameSize}px`);
        console.log(`  Remaining Height: ${img.height % frameSize}px`);
    });
    
    // Exakte Berechnung wenn kein Rest bleibt
    console.log('\n=== EXACT CALCULATIONS ===');
    testFrameSizes.forEach(frameSize => {
        const widthRemainder = img.width % frameSize;
        const heightRemainder = img.height % frameSize;
        
        if (widthRemainder === 0 && heightRemainder === 0) {
            console.log(`✓ PERFECT FIT: ${frameSize}x${frameSize}`);
            console.log(`  Grid: ${img.width / frameSize} cols x ${img.height / frameSize} rows`);
        }
    });
} else {
    console.error('Character sprite not loaded yet!');
}
```

## 2. Visueller Test - Sprite Sheet auf Canvas zeichnen

```javascript
// Canvas erstellen für visuelle Analyse
const testCanvas = document.createElement('canvas');
const testCtx = testCanvas.getContext('2d');
const img = assetLoader.get('character');

if (img && img.complete) {
    // Canvas auf Bildgröße setzen
    testCanvas.width = img.width;
    testCanvas.height = img.height;
    
    // Original-Bild zeichnen
    testCtx.drawImage(img, 0, 0);
    
    // Grid-Linien einzeichnen (test mit 100x100)
    const frameSize = 100;
    testCtx.strokeStyle = 'red';
    testCtx.lineWidth = 2;
    
    // Vertikale Linien
    for (let x = 0; x <= img.width; x += frameSize) {
        testCtx.beginPath();
        testCtx.moveTo(x, 0);
        testCtx.lineTo(x, img.height);
        testCtx.stroke();
    }
    
    // Horizontale Linien
    for (let y = 0; y <= img.height; y += frameSize) {
        testCtx.beginPath();
        testCtx.moveTo(0, y);
        testCtx.lineTo(img.width, y);
        testCtx.stroke();
    }
    
    // Canvas als neues Fenster anzeigen
    const win = window.open('', 'Sprite Analysis');
    win.document.body.appendChild(testCanvas);
    win.document.title = 'Character Sprite Sheet Analysis';
    
    console.log('✓ Analysis window opened - check grid alignment!');
}
```

## 3. Einzelne Frames extrahieren und testen

```javascript
// Frame-by-Frame Test
const img = assetLoader.get('character');
const frameWidth = 100;  // ANPASSEN basierend auf Analyse
const frameHeight = 100; // ANPASSEN basierend auf Analyse

if (img && img.complete) {
    const cols = Math.floor(img.width / frameWidth);
    const rows = Math.floor(img.height / frameHeight);
    
    console.log(`Testing ${cols}x${rows} grid...`);
    
    // Erste 6 Frames der ersten Zeile extrahieren (Idle Animation)
    for (let frame = 0; frame < Math.min(6, cols); frame++) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = frameWidth;
        canvas.height = frameHeight;
        
        // Frame ausschneiden
        ctx.drawImage(
            img,
            frame * frameWidth, 0,  // Source position
            frameWidth, frameHeight, // Source size
            0, 0,                    // Dest position
            frameWidth, frameHeight  // Dest size
        );
        
        // Frame als Bild-URL ausgeben
        const dataUrl = canvas.toDataURL();
        console.log(`Frame ${frame}:`, dataUrl.substring(0, 100) + '...');
        
        // Optional: Frame im DOM anzeigen
        canvas.style.border = '2px solid blue';
        canvas.style.margin = '5px';
        document.body.appendChild(canvas);
    }
    
    console.log('✓ First 6 frames extracted to page');
}
```

## 4. Sprite Sheet Dimensionen aus S3 abrufen

```javascript
fetch('https://user-gen-media-assets.s3.amazonaws.com/seedream_images/fa44d568-0299-47bd-ae9a-df62953fcc7d.png')
    .then(response => response.blob())
    .then(blob => {
        const img = new Image();
        img.onload = () => {
            console.log('=== S3 CHARACTER.PNG ===');
            console.log('Width:', img.width);
            console.log('Height:', img.height);
            console.log('Aspect Ratio:', (img.width / img.height).toFixed(2));
            
            // Wahrscheinliche Grid-Größen berechnen
            const commonFrameSizes = [32, 48, 64, 80, 96, 100, 128, 150, 200];
            console.log('\nPossible Grid Sizes:');
            commonFrameSizes.forEach(size => {
                if (img.width % size === 0 && img.height % size === 0) {
                    console.log(`✓ ${size}x${size} → ${img.width/size}x${img.height/size} grid`);
                }
            });
        };
        img.src = URL.createObjectURL(blob);
    })
    .catch(err => console.error('Failed to load S3 image:', err));
```

## 5. Echtzeit-Debugging während des Spiels

```javascript
// In player.js drawSprite() Methode diese Zeilen temporär hinzufügen:

console.log('Drawing sprite:', {
    animation: this.currentAnimation,
    frame: this.animationFrame,
    row: row,
    col: frame,
    sourceX: sx,
    sourceY: sy,
    sourceWidth: this.frameWidth,
    sourceHeight: this.frameHeight
});
```

## Typische Sprite Sheet Layouts:

### Standard Character Sheet (6x4):
```
Row 0: Idle (6 frames)
Row 1: Walk/Run (6 frames)
Row 2: Jump (6 frames)
Row 3: Special (6 frames)
```

### Alternative Layout (4x4):
```
Row 0: Idle (4 frames)
Row 1: Walk (4 frames)
Row 2: Run (4 frames)
Row 3: Jump (4 frames)
```

### High-Detail Layout (8x4):
```
Row 0: Idle (8 frames)
Row 1: Walk (8 frames)
Row 2: Run (8 frames)
Row 3: Jump/Fall (8 frames)
```

## Häufige Probleme:

1. **Weißes Quadrat statt Character**
   - Frame-Größe stimmt nicht
   - Zeilen/Spalten falsch berechnet
   - Transparenz nicht korrekt geladen

2. **Sprite flackert**
   - Animation-Frame außerhalb des Sprite Sheets
   - Row/Column Berechnung falsch

3. **Sprite gestreckt/verzerrt**
   - Frame-Größe nicht quadratisch wenn erwartet
   - Scale-Faktor falsch

## Quick Fix Workflow:

1. **Console öffnen** (F12)
2. **Analyse-Script ausführen** (Code #1 oben)
3. **Perfekte Frame-Größe identifizieren** (0px Rest)
4. **player.js updaten** mit korrekten Werten:
   ```javascript
   this.frameWidth = XXX;  // Aus Analyse
   this.frameHeight = XXX; // Aus Analyse
   this.cols = XXX;        // Aus Analyse
   this.rows = XXX;        // Aus Analyse
   ```
5. **Hard Refresh** (Strg + F5)

---

**Nach der Analyse diese Datei mit den tatsächlichen Werten updaten!**
