// Player Class for Crystal Rush
// Complete rewrite with fixed sprite animation system

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 64, 64);
        
        // Movement properties
        this.speed = 5;
        this.jumpPower = -13;
        this.maxSpeed = 8;
        
        // State
        this.facing = 1; // 1 = right, -1 = left (sprite is now facing right by default)
        this.jumping = false;
        this.canJump = true;
        this.invincible = false;
        this.invincibleTimer = 0;
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.currentAnimation = 'idle';
        
        // FIXED SPRITE SHEET DIMENSIONS
        // New character.png: 2048×512px
        // Grid: 8 columns × 1 row
        // Frame size: 256×512px each
        this.spriteSheet = null;
        this.frameWidth = 256;   // 2048 ÷ 8 = 256px per frame
        this.frameHeight = 512;  // Full height
        this.spriteScale = 0.5;  // Scale down to 128×256 for game (was too large)
        this.cols = 8;           // 8 frames total
        
        // Animation configurations
        // Frame indices for each animation state
        this.animations = {
            idle: { 
                startFrame: 0, 
                frameCount: 4,
                speed: 0.1  // Slow for idle breathing
            },
            run: { 
                startFrame: 4, 
                frameCount: 4,  // Frames 4, 5, 6, 7
                speed: 0.2      // Fast for running
            },
            jump: { 
                startFrame: 8,  // Single jump frame (if exists, else use idle)
                frameCount: 1,
                speed: 0
            },
            shoot: {
                startFrame: 9,  // Frames 9, 10, 11 (if implemented)
                frameCount: 3,
                speed: 0.15
            }
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
        
        // Determine animation state based on player state
        let newAnimation = 'idle';
        
        if (!this.onGround) {
            newAnimation = 'jump';
        } else if (Math.abs(this.velocityX) > 0.5) {
            newAnimation = 'run';
        } else {
            newAnimation = 'idle';
        }
        
        // Reset frame counter when animation changes
        if (newAnimation !== this.currentAnimation) {
            this.animationFrame = 0;
            this.animationTimer = 0;
        }
        
        this.currentAnimation = newAnimation;
        
        // Update animation frame
        const anim = this.animations[this.currentAnimation];
        
        if (anim.frameCount > 1) {
            this.animationTimer += deltaTime;
            
            // Advance frame when timer exceeds speed threshold
            if (this.animationTimer >= anim.speed) {
                this.animationFrame = (this.animationFrame + 1) % anim.frameCount;
                this.animationTimer = 0;
            }
        } else {
            // Static frame (like jump)
            this.animationFrame = 0;
        }
        
        // Update invincibility
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
        
        // Load sprite sheet if not loaded yet
        if (!this.spriteSheet) {
            this.spriteSheet = assetLoader.get('character');
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();
        
        // Proper alpha compositing for transparency
        ctx.globalCompositeOperation = 'source-over';
        
        // Flicker effect when invincible
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
        
        // Debug: Draw hitbox (uncomment for debugging)
        // this.drawDebugHitbox(ctx, screenX, screenY);
    }

    drawSprite(ctx, screenX, screenY) {
        // Get current animation config
        const anim = this.animations[this.currentAnimation];
        
        // Calculate which frame to show
        const currentFrameIndex = anim.startFrame + this.animationFrame;
        
        // Calculate source position in sprite sheet
        // Horizontal strip: each frame at column * frameWidth
        const sx = currentFrameIndex * this.frameWidth;
        const sy = 0; // Single row sprite sheet
        
        // Calculate draw dimensions
        const drawWidth = this.frameWidth * this.spriteScale;   // 256 * 0.5 = 128px
        const drawHeight = this.frameHeight * this.spriteScale; // 512 * 0.5 = 256px
        
        // Center the sprite on player hitbox (64×64)
        const drawX = screenX + this.width / 2 - drawWidth / 2;
        const drawY = screenY + this.height - drawHeight; // Align bottom
        
        ctx.save();
        
        // CRITICAL: Disable image smoothing for crisp pixel art
        ctx.imageSmoothingEnabled = false;
        
        // Flip sprite horizontally when facing left
        if (this.facing === -1) {
            ctx.translate(drawX + drawWidth, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.spriteSheet,
                sx, sy,                           // Source position
                this.frameWidth, this.frameHeight, // Source size
                0, 0,                             // Destination (already translated)
                drawWidth, drawHeight             // Destination size
            );
        } else {
            // Normal facing right
            ctx.drawImage(
                this.spriteSheet,
                sx, sy,                           // Source position
                this.frameWidth, this.frameHeight, // Source size
                drawX, drawY,                     // Destination position
                drawWidth, drawHeight             // Destination size
            );
        }
        
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
    
    drawDebugHitbox(ctx, screenX, screenY) {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, this.width, this.height);
        
        // Draw center point
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(screenX + this.width / 2 - 2, screenY + this.height / 2 - 2, 4, 4);
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
