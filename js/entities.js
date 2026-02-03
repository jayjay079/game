// Entity System for Crystal Rush

class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.active = true;
    }

    update(deltaTime) {
        // Override in child classes
    }

    draw(ctx, camera) {
        // Override in child classes
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class Platform extends Entity {
    constructor(x, y, width, height, color = '#8B4513') {
        super(x, y, width, height);
        this.color = color;
        this.type = 'solid';
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Only draw if on screen
        if (screenX + this.width < 0 || screenX > camera.width) return;

        // Draw platform with gradient
        const gradient = ctx.createLinearGradient(screenX, screenY, screenX, screenY + this.height);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.adjustColor(this.color, -30));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(screenX, screenY, this.width, this.height);

        // Top highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(screenX, screenY, this.width, 3);

        // Border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, this.width, this.height);
    }

    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
}

class Coin extends Entity {
    constructor(x, y) {
        super(x, y, 20, 20);
        this.collectable = true;
        this.rotation = 0;
        this.scale = 1;
        this.pulseSpeed = 0.05;
    }

    update(deltaTime) {
        this.rotation += 0.05;
        this.scale = 1 + Math.sin(this.rotation * 2) * 0.1;
    }

    draw(ctx, camera) {
        if (!this.active) return;

        const screenX = this.x - camera.x + this.width / 2;
        const screenY = this.y - camera.y + this.height / 2;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.scale(this.scale, this.scale);
        ctx.rotate(this.rotation);

        // Draw coin
        const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 15);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.7, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(-3, -3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    collect() {
        this.active = false;
        soundSystem.playCoin();
    }
}

class Crystal extends Entity {
    constructor(x, y, color = '#00CED1') {
        super(x, y, 30, 40);
        this.color = color;
        this.glowIntensity = 0;
        this.glowDirection = 1;
    }

    update(deltaTime) {
        this.glowIntensity += 0.02 * this.glowDirection;
        if (this.glowIntensity > 1 || this.glowIntensity < 0) {
            this.glowDirection *= -1;
        }
    }

    draw(ctx, camera) {
        if (!this.active) return;

        const screenX = this.x - camera.x + this.width / 2;
        const screenY = this.y - camera.y + this.height / 2;

        ctx.save();
        ctx.translate(screenX, screenY);

        // Glow effect
        const glowGradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 30 + this.glowIntensity * 10);
        glowGradient.addColorStop(0, this.color);
        glowGradient.addColorStop(0.5, this.color + '80');
        glowGradient.addColorStop(1, this.color + '00');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(-25, -25, 50, 50);

        // Crystal shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(12, -5);
        ctx.lineTo(12, 15);
        ctx.lineTo(0, 20);
        ctx.lineTo(-12, 15);
        ctx.lineTo(-12, -5);
        ctx.closePath();
        ctx.fill();

        // Highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(-5, -10);
        ctx.lineTo(0, -15);
        ctx.lineTo(5, -10);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    collect() {
        this.active = false;
        soundSystem.playPowerUp();
    }
}