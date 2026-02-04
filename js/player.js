// Player Class for Crystal Rush

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 40, 50);
        
        // Movement properties
        this.speed = 5;
        this.jumpPower = -13;
        this.maxSpeed = 8;
        
        // State
        this.facing = 1; // 1 = right, -1 = left
        this.jumping = false;
        this.canJump = true;
        this.invincible = false;
        this.invincibleTimer = 0;
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 0.15;
        this.currentAnimation = 'idle'; // idle, run, jump
        
        // Sprite sheet properties
        this.spriteSheet = null;
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.spriteScale = 1.2;
        
        // Stats
        this.lives = 3;
        this.coins = 0;
        
        // Track jumping for stats
        this.isJumping = false;
        this.wasJumping = false;
    }

    handleInput() {
        // Horizontal movement
        if (input.isLeft()) {
            this.velocityX = Math.max(this.velocityX - this.speed * 0.5, -this.maxSpeed);
            this.facing = -1;
        } else if (input.isRight()) {
            this.velocityX = Math.min(this.velocityX + this.speed * 0.5, this.maxSpeed);
            this.facing = 1;
        }

        // Jump
        if (input.isJump() && this.onGround && this.canJump) {
            this.velocityY = this.jumpPower;
            this.jumping = true;
            this.isJumping = true;
            this.canJump = false;
            this.onGround = false;
            soundSystem.playJump();
        } else if (this.onGround) {
            this.isJumping = false;
        }

        // Release jump for variable height
        if (!input.isJump() && this.jumping && this.velocityY < 0) {
            this.velocityY *= 0.5;
            this.jumping = false;
        }

        // Reset jump when released
        if (!input.isJump()) {
            this.canJump = true;
        }
    }

    update(deltaTime, physics, platforms) {
        this.handleInput();
        
        // Update physics
        physics.update(this, platforms);
        
        // Determine animation state
        if (!this.onGround) {
            this.currentAnimation = 'jump';
        } else if (Math.abs(this.velocityX) > 0.5) {
            this.currentAnimation = 'run';
        } else {
            this.currentAnimation = 'idle';
        }
        
        // Update animation frame
        if (this.currentAnimation === 'run') {
            this.animationTimer += deltaTime * this.animationSpeed;
            if (this.animationTimer >= 1) {
                this.animationFrame = (this.animationFrame + 1) % 6; // 6 run frames
                this.animationTimer = 0;
            }
        } else if (this.currentAnimation === 'idle') {
            this.animationTimer += deltaTime * 0.1;
            if (this.animationTimer >= 1) {
                this.animationFrame = (this.animationFrame + 1) % 4; // 4 idle frames
                this.animationTimer = 0;
            }
        } else {
            this.animationFrame = 0; // Jump uses frame 0
        }
        
        // Update invincibility
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
        
        // Load sprite sheet if not loaded
        if (!this.spriteSheet) {
            this.spriteSheet = assetLoader.get('character');
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Flicker when invincible
        if (this.invincible && Math.floor(this.invincibleTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        ctx.save();
        
        // Use sprite if available, otherwise fallback to procedural
        if (this.spriteSheet && this.spriteSheet.complete) {
            this.drawSprite(ctx, screenX, screenY);
        } else {
            // Fallback to procedural drawing
            ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
            ctx.scale(this.facing, 1);
            this.drawCharacter(ctx);
        }

        ctx.restore();
        ctx.globalAlpha = 1;
    }

    drawSprite(ctx, screenX, screenY) {
        // Calculate sprite sheet coordinates based on animation
        let row = 0;
        let maxFrames = 4;
        
        switch(this.currentAnimation) {
            case 'idle':
                row = 0;
                maxFrames = 4;
                break;
            case 'run':
                row = 1;
                maxFrames = 6;
                break;
            case 'jump':
                row = 2;
                maxFrames = 1;
                break;
        }
        
        const frame = this.animationFrame % maxFrames;
        const sx = frame * this.frameWidth;
        const sy = row * this.frameHeight;
        
        const drawWidth = this.frameWidth * this.spriteScale;
        const drawHeight = this.frameHeight * this.spriteScale;
        
        ctx.save();
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
        
        // Flip sprite based on facing direction
        if (this.facing === -1) {
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(
            this.spriteSheet,
            sx, sy,
            this.frameWidth, this.frameHeight,
            -drawWidth / 2, -drawHeight / 2,
            drawWidth, drawHeight
        );
        
        ctx.restore();
    }

    drawCharacter(ctx) {
        // Fallback procedural drawing (original code)
        // Body - Teal jacket
        ctx.fillStyle = '#20B2AA';
        ctx.fillRect(-15, -10, 30, 35);

        // Head
        ctx.fillStyle = '#FFD8B5';
        ctx.beginPath();
        ctx.arc(0, -20, 12, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.arc(-3, -25, 10, 0, Math.PI);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(-5, -22, 3, 3);
        ctx.fillRect(2, -22, 3, 3);

        // Legs
        ctx.fillStyle = '#4A4A4A';
        ctx.fillRect(-12, 25, 10, 15);
        ctx.fillRect(2, 25, 10, 15);

        // Arms - with slight animation
        ctx.fillStyle = '#20B2AA';
        const armSwing = Math.sin(this.animationFrame * Math.PI * 2) * 5;
        ctx.fillRect(-18, -5 + armSwing, 8, 20);
        ctx.fillRect(10, -5 - armSwing, 8, 20);

        // Orange accents
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(-15, 5, 30, 3);
        ctx.fillRect(-15, 15, 30, 3);

        // Backpack
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-10, -5, 8, 12);
    }

    takeDamage() {
        if (this.invincible) return false;
        
        this.lives--;
        this.invincible = true;
        this.invincibleTimer = 120; // 2 seconds at 60fps
        soundSystem.playHurt();
        
        // Knockback
        this.velocityY = -8;
        this.velocityX = -this.facing * 5;
        
        return this.lives <= 0;
    }

    collectCoin() {
        this.coins++;
        // Extra life every 100 coins
        if (this.coins % 100 === 0) {
            this.lives++;
            soundSystem.playPowerUp();
        }
    }

    reset() {
        this.x = 100;
        this.y = 300;
        this.velocityX = 0;
        this.velocityY = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
    }
}
