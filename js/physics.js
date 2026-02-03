// Physics Engine for Crystal Rush

class PhysicsEngine {
    constructor() {
        this.gravity = 0.6;
        this.maxFallSpeed = 15;
        this.friction = 0.8;
    }

    applyGravity(entity) {
        if (!entity.onGround) {
            entity.velocityY += this.gravity;
            entity.velocityY = Math.min(entity.velocityY, this.maxFallSpeed);
        }
    }

    applyFriction(entity) {
        if (entity.onGround) {
            entity.velocityX *= this.friction;
        }
    }

    // Check collision between entity and platform
    checkPlatformCollision(entity, platform) {
        // Basic AABB collision
        const collision = Utils.checkCollision(
            {
                x: entity.x,
                y: entity.y,
                width: entity.width,
                height: entity.height
            },
            platform
        );

        if (!collision) return null;

        // Determine collision side
        const entityBottom = entity.y + entity.height;
        const entityRight = entity.x + entity.width;
        const platformBottom = platform.y + platform.height;
        const platformRight = platform.x + platform.width;

        // Calculate overlap on each side
        const overlapLeft = entityRight - platform.x;
        const overlapRight = platformRight - entity.x;
        const overlapTop = entityBottom - platform.y;
        const overlapBottom = platformBottom - entity.y;

        // Find minimum overlap
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        // Determine collision type
        if (minOverlap === overlapTop && entity.velocityY > 0) {
            return { side: 'top', overlap: overlapTop };
        } else if (minOverlap === overlapBottom && entity.velocityY < 0) {
            return { side: 'bottom', overlap: overlapBottom };
        } else if (minOverlap === overlapLeft && entity.velocityX > 0) {
            return { side: 'left', overlap: overlapLeft };
        } else if (minOverlap === overlapRight && entity.velocityX < 0) {
            return { side: 'right', overlap: overlapRight };
        }

        return null;
    }

    resolveCollision(entity, collision, platform) {
        switch (collision.side) {
            case 'top':
                entity.y = platform.y - entity.height;
                entity.velocityY = 0;
                entity.onGround = true;
                break;
            case 'bottom':
                entity.y = platform.y + platform.height;
                entity.velocityY = 0;
                break;
            case 'left':
                entity.x = platform.x - entity.width;
                entity.velocityX = 0;
                break;
            case 'right':
                entity.x = platform.x + platform.width;
                entity.velocityX = 0;
                break;
        }
    }

    update(entity, platforms) {
        // Reset ground state
        entity.onGround = false;

        // Apply physics
        this.applyGravity(entity);
        this.applyFriction(entity);

        // Apply velocity
        entity.x += entity.velocityX;
        entity.y += entity.velocityY;

        // Check collisions with all platforms
        platforms.forEach(platform => {
            const collision = this.checkPlatformCollision(entity, platform);
            if (collision) {
                this.resolveCollision(entity, collision, platform);
            }
        });

        // Prevent falling through world bottom
        if (entity.y > 800) {
            entity.y = 800;
            entity.velocityY = 0;
            entity.onGround = true;
        }
    }
}