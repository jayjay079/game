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
        
        // FIXED: Actual sprite sheet dimensions from analysis
        // 2048x2048 image with 64x64 frames in 32x32 grid = 1024 total frames
        this.spriteSheet = null;
        this.frameWidth = 64;   // Analyzed: perfect fit at 64x64
        this.frameHeight = 64;  // Analyzed: perfect fit at 64x64
        this.spriteScale = 1.2; // Scale up for visibility
        this.cols = 32;         // 2048 / 64 = 32 columns
        this.rows = 32;         // 2048 / 64 = 32 rows
        
        // Animation frame mappings (assuming standard layout)
        // Using first few rows for main animations
        this.animations = {
            idle: { row: 0, frames: 6 },  // Row 0, first 6 frames
            run: { row: 1, frames: 6 },   // Row 1, first 6 frames
            jump: { row: 2, frames: 1 }   // Row 2, first frame
        };
        
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
        const anim = this.animations[this.currentAnimation];
        if (this.currentAnimation === 'run') {
            this.animationTimer += deltaTime * this.animationSpeed;
            if (this.animationTimer >= 1) {
                this.animationFrame = (this.animationFrame + 1) % anim.frames;
                this.animationTimer = 0;
            }
        } else if (this.currentAnimation === 'idle') {
            this.animationTimer += deltaTime * 0.1;
            if (this.animationTimer >= 1) {
                this.animationFrame = (this.animationFrame + 1) % anim.frames;
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

        ctx.save();
        
        // CRITICAL: Proper alpha compositing for transparency
        ctx.globalCompositeOperation = 'source-over';
        
        // Flicker when invincible
        if (this.invincible && Math.floor(this.invincibleTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        } else {
            ctx.globalAlpha = 1.0;
        }

        // Use sprite if available, otherwise fallback to procedural
        if (this.spriteSheet && this.spriteSheet.complete && this.spriteSheet.width > 0) {
            this.drawSprite(ctx, screenX, screenY);
        } else {
            // Fallback to procedural drawing
            ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
            ctx.scale(this.facing, 1);
            this.drawCharacter(ctx);
        }

        ctx.restore();
    }

    drawSprite(ctx, screenX, screenY) {
        // Get current animation config
        const anim = this.animations[this.currentAnimation];
        const row = anim.row;
        const frame = this.animationFrame % anim.frames;
        
        // Calculate source position in sprite sheet
        // 2048x2048 sheet, 64x64 frames, 32x32 grid
        const sx = frame * this.frameWidth;
        const sy = row * this.frameHeight;
        
        const drawWidth = this.frameWidth * this.spriteScale;
        const drawHeight = this.frameHeight * this.spriteScale;
        
        // Center the sprite on player hitbox
        const drawX = screenX + this.width / 2 - drawWidth / 2;
        const drawY = screenY + this.height / 2 - drawHeight / 2;
        
        ctx.save();
        
        // CRITICAL: Disable image smoothing for crisp pixel art
        ctx.imageSmoothingEnabled = false;
        
        // Flip sprite based on facing direction
        if (this.facing === -1) {
            ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
            ctx.scale(-1, 1);
            ctx.translate(-(drawX + drawWidth / 2), -(drawY + drawHeight / 2));
        }
        
        // Draw the sprite frame
        ctx.drawImage(
            this.spriteSheet,
            sx, sy,                    // Source position
            this.frameWidth, this.frameHeight, // Source size
            drawX, drawY,              // Destination position
            drawWidth, drawHeight      // Destination size
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
