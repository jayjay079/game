// Parallax Scrolling System for Crystal Rush

class ParallaxLayer {
    constructor(color, scrollSpeed, offsetY = 0) {
        this.color = color;
        this.scrollSpeed = scrollSpeed; // 0.0 to 1.0 (slower to faster)
        this.offsetY = offsetY;
        this.x = 0;
        this.elements = []; // Can contain shapes, gradients, etc.
    }

    update(cameraX, cameraSpeed) {
        this.x = -cameraX * this.scrollSpeed;
    }

    draw(ctx, canvas) {
        ctx.save();
        ctx.translate(this.x, this.offsetY);
        
        // Draw layer background
        if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.x, -this.offsetY, canvas.width, canvas.height);
        }
        
        // Draw layer elements
        this.elements.forEach(element => {
            if (element.draw) {
                element.draw(ctx, -this.x, canvas.width);
            }
        });
        
        ctx.restore();
    }
}

// Image-based Parallax Layer with proper transparency
class ParallaxImageLayer {
    constructor(imageName, scrollSpeed, offsetY = 0) {
        this.imageName = imageName;
        this.scrollSpeed = scrollSpeed;
        this.offsetY = offsetY;
        this.x = 0;
    }

    update(cameraX) {
        this.x = -cameraX * this.scrollSpeed;
    }

    draw(ctx, canvas) {
        const img = assetLoader.get(this.imageName);
        if (!img || !img.complete) return;

        const imgWidth = img.width;
        const imgHeight = img.height;
        
        // Calculate scale to fit canvas height while maintaining aspect ratio
        const scale = canvas.height / imgHeight;
        const scaledWidth = imgWidth * scale;
        const scaledHeight = canvas.height;

        // Calculate how many times to tile the image
        const tilesNeeded = Math.ceil(canvas.width / scaledWidth) + 2;
        
        // Calculate starting position for seamless tiling
        let startX = (this.x % scaledWidth);
        if (startX > 0) startX -= scaledWidth;

        ctx.save();
        
        // Draw tiled images for seamless scrolling
        for (let i = 0; i < tilesNeeded; i++) {
            const drawX = startX + (i * scaledWidth);
            
            ctx.drawImage(
                img,
                drawX,
                this.offsetY,
                scaledWidth,
                scaledHeight
            );
        }
        
        ctx.restore();
    }
}

class ParallaxSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.layers = [];
        this.cameraX = 0;
        this.cameraSpeed = 0;
    }

    addLayer(layer) {
        this.layers.push(layer);
        // Sort layers by scroll speed (background to foreground)
        this.layers.sort((a, b) => a.scrollSpeed - b.scrollSpeed);
    }

    update(cameraX, cameraSpeed) {
        this.cameraX = cameraX;
        this.cameraSpeed = cameraSpeed;
        
        this.layers.forEach(layer => {
            layer.update(cameraX, cameraSpeed);
        });
    }

    draw(ctx) {
        // Draw all layers in order (back to front)
        // Each layer is drawn with transparency preserved
        this.layers.forEach(layer => {
            layer.draw(ctx, this.canvas);
        });
    }

    clear() {
        this.layers = [];
    }
}

// Parallax Element Classes (keep for fallback)
class Mountain {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx, cameraX, canvasWidth) {
        if (this.x + this.width < cameraX || this.x > cameraX + canvasWidth) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
}

class Cloud {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw(ctx, cameraX, canvasWidth) {
        if (this.x + this.size * 3 < cameraX || this.x > cameraX + canvasWidth) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.8, this.y, this.size * 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 1.6, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Tree {
    constructor(x, y, size, trunkColor, foliageColor) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.trunkColor = trunkColor;
        this.foliageColor = foliageColor;
    }

    draw(ctx, cameraX, canvasWidth) {
        if (this.x + this.size < cameraX || this.x > cameraX + canvasWidth) return;
        ctx.fillStyle = this.trunkColor;
        ctx.fillRect(this.x + this.size * 0.4, this.y, this.size * 0.2, this.size * 0.6);
        ctx.fillStyle = this.foliageColor;
        ctx.beginPath();
        ctx.arc(this.x + this.size * 0.5, this.y - this.size * 0.2, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
