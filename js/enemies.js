// Enemy Classes for Crystal Rush

class Enemy extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.health = 1;
        this.speed = 2;
        this.direction = 1;
        this.patrolDistance = 150;
        this.startX = x;
    }

    update(deltaTime, physics, platforms) {
        // Basic patrol movement
        this.velocityX = this.speed * this.direction;
        
        // Turn around at patrol limits
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
        
        // Apply physics
        physics.update(this, platforms);
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.active = false;
            soundSystem.playEnemyHit();
            return true;
        }
        return false;
    }

    checkPlayerCollision(player) {
        if (!this.active || player.invincible) return null;
        
        const collision = Utils.checkCollision(
            player.getBounds(),
            this.getBounds()
        );
        
        if (collision) {
            // Check if player is jumping on enemy
            if (player.velocityY > 0 && player.y + player.height - 10 < this.y + 10) {
                return 'stomp';
            } else {
                return 'hit';
            }
        }
        
        return null;
    }
}

class ForestSprite extends Enemy {
    constructor(x, y) {
        super(x, y, 35, 35);
        this.speed = 1.5;
        this.floatOffset = 0;
        this.floatSpeed = 0.05;
    }

    update(deltaTime, physics, platforms) {
        super.update(deltaTime, physics, platforms);
        this.floatOffset += this.floatSpeed;
    }

    draw(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x + this.width / 2;
        const screenY = this.y - camera.y + this.height / 2 + Math.sin(this.floatOffset) * 5;

        ctx.save();
        ctx.translate(screenX, screenY);

        // Glow effect
        const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, 25);
        glow.addColorStop(0, '#90EE90');
        glow.addColorStop(1, 'rgba(144, 238, 144, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(-25, -25, 50, 50);

        // Body
        ctx.fillStyle = '#32CD32';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Energy swirl
        ctx.strokeStyle = '#90EE90';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Leaf ears
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(-12, -8, 8, 12, -0.5, 0, Math.PI * 2);
        ctx.ellipse(12, -8, 8, 12, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(-6, -3, 5, 5);
        ctx.fillRect(1, -3, 5, 5);

        // Pupils
        ctx.fillStyle = '#000';
        ctx.fillRect(-4, -1, 2, 2);
        ctx.fillRect(3, -1, 2, 2);

        // Smile
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 2, 6, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Stubby legs
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(-8, 12, 6, 8);
        ctx.fillRect(2, 12, 6, 8);

        ctx.restore();
    }
}

class RockGolem extends Enemy {
    constructor(x, y) {
        super(x, y, 45, 50);
        this.health = 2;
        this.speed = 1;
        this.patrolDistance = 100;
    }

    draw(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);

        // Body segments
        ctx.fillStyle = '#696969';
        
        // Torso
        ctx.fillRect(-15, -15, 30, 30);
        
        // Head
        ctx.fillRect(-12, -25, 24, 18);
        
        // Arms
        ctx.fillRect(-22, -10, 12, 20);
        ctx.fillRect(10, -10, 12, 20);
        
        // Legs
        ctx.fillRect(-12, 15, 10, 15);
        ctx.fillRect(2, 15, 10, 15);

        // Crystal veins - cyan glow
        ctx.strokeStyle = '#00CED1';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        
        // Vein pattern
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.lineTo(0, 15);
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, -10);
        ctx.moveTo(-8, 5);
        ctx.lineTo(8, 5);
        ctx.stroke();
        
        ctx.globalAlpha = 1;

        // Glowing core
        const coreGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 15);
        coreGlow.addColorStop(0, '#00CED1');
        coreGlow.addColorStop(1, 'rgba(0, 206, 209, 0)');
        ctx.fillStyle = coreGlow;
        ctx.fillRect(-15, -10, 30, 20);

        // Core crystal
        ctx.fillStyle = '#00CED1';
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class VoidMoth extends Enemy {
    constructor(x, y) {
        super(x, y, 40, 30);
        this.speed = 2;
        this.patrolDistance = 200;
        this.wingFlap = 0;
        this.flyHeight = y;
        this.verticalOffset = 0;
    }

    update(deltaTime, physics, platforms) {
        // Horizontal patrol
        this.velocityX = this.speed * this.direction;
        
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
        
        // Vertical wave motion
        this.verticalOffset += 0.05;
        this.y = this.flyHeight + Math.sin(this.verticalOffset) * 30;
        
        // Wing flap animation
        this.wingFlap += 0.2;
        
        // Apply horizontal movement
        this.x += this.velocityX;
    }

    draw(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x + this.width / 2;
        const screenY = this.y - camera.y + this.height / 2;

        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Particle trail
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = `rgba(138, 43, 226, ${0.3 - i * 0.1})`;
            ctx.beginPath();
            ctx.arc(-10 - i * 5, 0, 3 - i, 0, Math.PI * 2);
            ctx.fill();
        }

        // Wings
        const wingScale = 1 + Math.sin(this.wingFlap) * 0.2;
        
        // Left wing
        const leftWingGradient = ctx.createRadialGradient(-15, 0, 5, -15, 0, 20);
        leftWingGradient.addColorStop(0, '#8B008B');
        leftWingGradient.addColorStop(0.7, '#9370DB');
        leftWingGradient.addColorStop(1, 'rgba(147, 112, 219, 0)');
        
        ctx.fillStyle = leftWingGradient;
        ctx.beginPath();
        ctx.ellipse(-15, 0, 18 * wingScale, 12, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Right wing
        const rightWingGradient = ctx.createRadialGradient(15, 0, 5, 15, 0, 20);
        rightWingGradient.addColorStop(0, '#8B008B');
        rightWingGradient.addColorStop(0.7, '#9370DB');
        rightWingGradient.addColorStop(1, 'rgba(147, 112, 219, 0)');
        
        ctx.fillStyle = rightWingGradient;
        ctx.beginPath();
        ctx.ellipse(15, 0, 18 * wingScale, 12, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sparkles
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 3; i++) {
            const angle = this.wingFlap + i * (Math.PI * 2 / 3);
            const sparkX = Math.cos(angle) * 15;
            const sparkY = Math.sin(angle) * 10;
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Antennae
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-3, -10);
        ctx.lineTo(-5, -15);
        ctx.moveTo(3, -10);
        ctx.lineTo(5, -15);
        ctx.stroke();
        
        // Antenna tips (glowing)
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(-5, -15, 2, 0, Math.PI * 2);
        ctx.arc(5, -15, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}