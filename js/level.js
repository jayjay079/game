// Level System for Crystal Rush

class Level {
    constructor(levelData) {
        this.width = levelData.width || 3000;
        this.height = levelData.height || 600;
        this.platforms = [];
        this.coins = [];
        this.crystals = [];
        this.enemies = [];
        this.startX = levelData.startX || 100;
        this.startY = levelData.startY || 300;
        this.goalX = levelData.goalX || 2800;
        this.name = levelData.name || 'Level 1';
        this.world = levelData.world || 1;
        this.timeLimit = levelData.timeLimit || 300;
        
        this.buildLevel(levelData);
    }

    buildLevel(data) {
        // Build platforms
        if (data.platforms) {
            data.platforms.forEach(p => {
                this.platforms.push(new Platform(p.x, p.y, p.width, p.height, p.color));
            });
        }

        // Place coins
        if (data.coins) {
            data.coins.forEach(c => {
                this.coins.push(new Coin(c.x, c.y));
            });
        }

        // Place crystals
        if (data.crystals) {
            data.crystals.forEach(c => {
                this.crystals.push(new Crystal(c.x, c.y, c.color));
            });
        }

        // Spawn enemies
        if (data.enemies) {
            data.enemies.forEach(e => {
                switch(e.type) {
                    case 'sprite':
                        this.enemies.push(new ForestSprite(e.x, e.y));
                        break;
                    case 'golem':
                        this.enemies.push(new RockGolem(e.x, e.y));
                        break;
                    case 'moth':
                        this.enemies.push(new VoidMoth(e.x, e.y));
                        break;
                }
            });
        }
    }

    update(deltaTime, physics) {
        // Update all entities
        this.coins.forEach(coin => coin.update(deltaTime));
        this.crystals.forEach(crystal => crystal.update(deltaTime));
        this.enemies.forEach(enemy => {
            if (enemy.active) {
                enemy.update(deltaTime, physics, this.platforms);
            }
        });
    }

    draw(ctx, camera) {
        // Draw platforms
        this.platforms.forEach(platform => platform.draw(ctx, camera));
        
        // Draw coins
        this.coins.forEach(coin => coin.draw(ctx, camera));
        
        // Draw crystals
        this.crystals.forEach(crystal => crystal.draw(ctx, camera));
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(ctx, camera));
        
        // Draw goal flag
        this.drawGoal(ctx, camera);
    }

    drawGoal(ctx, camera) {
        const screenX = this.goalX - camera.x;
        const screenY = 200;

        if (screenX < -50 || screenX > camera.width + 50) return;

        // Flag pole
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(screenX, screenY, 8, 200);

        // Flag
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(screenX + 8, screenY);
        ctx.lineTo(screenX + 60, screenY + 20);
        ctx.lineTo(screenX + 8, screenY + 40);
        ctx.closePath();
        ctx.fill();

        // Flag border
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Checkered pattern
        ctx.fillStyle = '#FFA500';
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.fillRect(screenX + 8 + i * 20, screenY + j * 20, 20, 20);
                }
            }
        }
    }

    checkGoalReached(player) {
        return player.x > this.goalX - 50;
    }
}

// Level Data Definitions
const LEVELS = {
    world1_level1: {
        name: 'Goldene Wiesen - Level 1',
        world: 1,
        width: 3000,
        height: 600,
        startX: 100,
        startY: 300,
        goalX: 2800,
        timeLimit: 300,
        
        platforms: [
            // Ground
            { x: 0, y: 500, width: 800, height: 100, color: '#8B7355' },
            { x: 900, y: 500, width: 300, height: 100, color: '#8B7355' },
            { x: 1300, y: 500, width: 400, height: 100, color: '#8B7355' },
            { x: 1800, y: 500, width: 500, height: 100, color: '#8B7355' },
            { x: 2400, y: 500, width: 600, height: 100, color: '#8B7355' },
            
            // Floating platforms
            { x: 300, y: 400, width: 120, height: 20, color: '#9B8B6E' },
            { x: 500, y: 350, width: 120, height: 20, color: '#9B8B6E' },
            { x: 700, y: 300, width: 120, height: 20, color: '#9B8B6E' },
            
            { x: 1000, y: 380, width: 100, height: 20, color: '#9B8B6E' },
            { x: 1150, y: 320, width: 100, height: 20, color: '#9B8B6E' },
            
            { x: 1500, y: 350, width: 150, height: 20, color: '#9B8B6E' },
            { x: 1700, y: 280, width: 120, height: 20, color: '#9B8B6E' },
            
            { x: 2000, y: 400, width: 100, height: 20, color: '#9B8B6E' },
            { x: 2150, y: 350, width: 100, height: 20, color: '#9B8B6E' },
            { x: 2300, y: 300, width: 100, height: 20, color: '#9B8B6E' },
        ],
        
        coins: [
            // Ground coins
            { x: 200, y: 450 }, { x: 240, y: 450 }, { x: 280, y: 450 },
            { x: 950, y: 450 }, { x: 990, y: 450 }, { x: 1030, y: 450 },
            { x: 1400, y: 450 }, { x: 1440, y: 450 }, { x: 1480, y: 450 },
            
            // Platform coins
            { x: 340, y: 360 }, { x: 380, y: 360 },
            { x: 540, y: 310 }, { x: 580, y: 310 },
            { x: 740, y: 260 }, { x: 780, y: 260 },
            
            { x: 1030, y: 340 }, { x: 1070, y: 340 },
            { x: 1540, y: 310 }, { x: 1580, y: 310 },
            { x: 1740, y: 240 }, { x: 1780, y: 240 },
            
            { x: 2040, y: 360 }, { x: 2080, y: 360 },
            { x: 2190, y: 310 }, { x: 2230, y: 310 },
            { x: 2340, y: 260 }, { x: 2380, y: 260 },
            
            // Bonus high coins
            { x: 450, y: 250 },
            { x: 1200, y: 220 },
            { x: 1900, y: 280 },
        ],
        
        crystals: [
            { x: 600, y: 200, color: '#00CED1' },
            { x: 1600, y: 250, color: '#FF69B4' },
            { x: 2500, y: 400, color: '#FFD700' },
        ],
        
        enemies: [
            { type: 'sprite', x: 400, y: 450 },
            { type: 'sprite', x: 1100, y: 450 },
            { type: 'golem', x: 1400, y: 450 },
            { type: 'sprite', x: 1900, y: 450 },
            { type: 'moth', x: 1200, y: 250 },
            { type: 'moth', x: 2200, y: 280 },
        ]
    }
};

class LevelManager {
    constructor() {
        this.currentLevel = null;
        this.currentLevelKey = null;
    }

    loadLevel(levelKey) {
        if (LEVELS[levelKey]) {
            this.currentLevelKey = levelKey;
            this.currentLevel = new Level(LEVELS[levelKey]);
            return this.currentLevel;
        }
        return null;
    }

    getNextLevel() {
        // For now, just replay the same level
        // TODO: Implement multiple levels
        return this.currentLevelKey;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }
}