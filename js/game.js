// Game Manager for Crystal Rush

class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.target = null;
        this.smoothing = 0.1;
        this.bounds = { left: 0, right: 3000, top: 0, bottom: 600 };
    }

    follow(target) {
        this.target = target;
    }

    update() {
        if (!this.target) return;

        // Calculate desired camera position (target in center)
        const targetX = this.target.x - this.width / 2 + this.target.width / 2;
        const targetY = this.target.y - this.height / 2 + this.target.height / 2;

        // Smooth camera movement
        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;

        // Clamp camera to level bounds
        this.x = Utils.clamp(this.x, this.bounds.left, this.bounds.right - this.width);
        this.y = Utils.clamp(this.y, this.bounds.top, this.bounds.bottom - this.height);
    }

    setBounds(left, right, top, bottom) {
        this.bounds = { left, right, top, bottom };
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false });
        this.width = 1200;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // CRITICAL: Disable image smoothing globally for crisp high-res pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        console.log('✓ Image smoothing DISABLED for crisp graphics');

        // Game systems
        this.physics = new PhysicsEngine();
        this.parallax = new ParallaxSystem(this.canvas);
        this.camera = new Camera(this.width, this.height);
        this.levelManager = new LevelManager();

        // Game state
        this.state = 'menu';
        this.player = null;
        this.currentLevel = null;
        this.currentLevelId = 'world1_level1';

        // Game stats
        this.score = 0;
        this.timeRemaining = 300;
        this.timeAccumulator = 0;
        this.levelStartTime = 0;

        // Statistics tracking
        this.stats = {
            jumps: 0,
            deaths: 0,
            enemiesKilled: 0,
            coinsCollected: 0
        };

        // Animation
        this.lastTime = 0;
        this.animationId = null;

        // Setup
        this.setupParallax();
        this.setupEventListeners();
        this.initializeSystems();
    }

    initializeSystems() {
        // Initialize storage system
        if (typeof gameStorage !== 'undefined') {
            gameStorage.init();
            console.log('✓ Storage system initialized');
        }

        // Initialize touch controls on mobile
        if (typeof touchControls !== 'undefined') {
            touchControls.init();
            console.log('✓ Touch controls initialized');
        }
    }

    setupParallax() {
        // Sky background
        const skyLayer = new ParallaxLayer(
            'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)',
            0
        );
        this.parallax.addLayer(skyLayer);

        // FIXED: All offsetY = 0 for proper overlay, not vertical stacking!
        this.parallax.addLayer(new ParallaxImageLayer('bg_mountains', 0.1, 0));
        this.parallax.addLayer(new ParallaxImageLayer('bg_clouds', 0.2, 0));
        this.parallax.addLayer(new ParallaxImageLayer('bg_hills', 0.3, 0));
        this.parallax.addLayer(new ParallaxImageLayer('bg_trees', 0.7, 0));
        
        console.log('✓ Parallax fixed: layers overlay with transparency');
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.resumeGame();
        });
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startGame();
        });
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.startGame();
        });
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.loadNextLevel();
        });

        let pausePressed = false;
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !pausePressed) {
                pausePressed = true;
                if (this.state === 'playing') {
                    this.pauseGame();
                } else if (this.state === 'paused') {
                    this.resumeGame();
                }
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                pausePressed = false;
            }
        });
    }

    startGame(levelId = 'world1_level1') {
        this.state = 'playing';
        this.currentLevelId = levelId;
        this.score = 0;
        
        // Reset statistics
        this.stats = {
            jumps: 0,
            deaths: 0,
            enemiesKilled: 0,
            coinsCollected: 0
        };
        
        this.currentLevel = this.levelManager.loadLevel(levelId);
        this.timeRemaining = this.currentLevel.timeLimit;
        this.timeAccumulator = 0;
        this.levelStartTime = Date.now();

        this.player = new Player(this.currentLevel.startX, this.currentLevel.startY);
        this.camera.follow(this.player);
        this.camera.setBounds(0, this.currentLevel.width, 0, this.currentLevel.height);

        this.hideAllScreens();
        soundSystem.startMusic();

        // Enable touch controls when game starts
        if (typeof touchControls !== 'undefined' && touchControls.enabled) {
            touchControls.show();
        }

        this.lastTime = performance.now();
        this.gameLoop();
    }

    pauseGame() {
        this.state = 'paused';
        document.getElementById('pause-screen').classList.remove('hidden');
        soundSystem.stopMusic();
        
        // Hide touch controls during pause
        if (typeof touchControls !== 'undefined') {
            touchControls.hide();
        }
    }

    resumeGame() {
        this.state = 'playing';
        document.getElementById('pause-screen').classList.add('hidden');
        soundSystem.startMusic();
        
        // Show touch controls when resuming
        if (typeof touchControls !== 'undefined' && touchControls.enabled) {
            touchControls.show();
        }
        
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameOver() {
        this.state = 'gameover';
        
        // Hide touch controls on game over
        if (typeof touchControls !== 'undefined') {
            touchControls.hide();
        }
        
        // Update storage with death
        if (typeof gameStorage !== 'undefined') {
            gameStorage.incrementStat('deaths', 1);
            console.log('✓ Death recorded in statistics');
        }
        
        document.getElementById('final-score').textContent = `Score: ${this.score} | Coins: ${this.player.coins}`;
        document.getElementById('gameover-screen').classList.remove('hidden');
        soundSystem.stopMusic();
        soundSystem.playGameOver();
    }

    levelComplete() {
        this.state = 'levelcomplete';
        const timeBonus = Math.floor(this.timeRemaining * 10);
        this.score += timeBonus;
        
        // Calculate level completion time
        const completionTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
        
        // Hide touch controls on level complete
        if (typeof touchControls !== 'undefined') {
            touchControls.hide();
        }
        
        // Update storage with progress
        if (typeof gameStorage !== 'undefined') {
            const wasNewHighscore = gameStorage.updateProgress(
                this.currentLevelId,
                this.score,
                completionTime,
                this.player.coins
            );
            
            // Update statistics
            gameStorage.incrementStat('jumps', this.stats.jumps);
            gameStorage.incrementStat('enemiesKilled', this.stats.enemiesKilled);
            gameStorage.incrementStat('coinsCollected', this.stats.coinsCollected);
            gameStorage.incrementStat('playTime', completionTime);
            
            console.log('✓ Progress saved:', {
                level: this.currentLevelId,
                score: this.score,
                highscore: wasNewHighscore,
                time: completionTime
            });
        }
        
        // Display level stats
        const highscoreText = typeof gameStorage !== 'undefined' 
            ? gameStorage.getHighscore(this.currentLevelId)
            : this.score;
            
        document.getElementById('level-stats').innerHTML = `
            <p>Coins: ${this.player.coins}</p>
            <p>Time Bonus: ${timeBonus}</p>
            <p>Total Score: ${this.score}</p>
            <p>Highscore: ${highscoreText}</p>
            <p style="font-size: 12px; color: #888; margin-top: 10px;">
                Jumps: ${this.stats.jumps} | Enemies: ${this.stats.enemiesKilled}
            </p>
        `;
        document.getElementById('level-complete-screen').classList.remove('hidden');
        soundSystem.stopMusic();
        soundSystem.playLevelComplete();
    }

    loadNextLevel() {
        // Determine next level based on current level
        const levelMap = {
            'world1_level1': 'world1_level2',
            'world1_level2': 'world1_level3',
            'world1_level3': 'world1_level4',
            'world1_level4': 'world2_level1',
            'world2_level1': 'world2_level2',
            'world2_level2': 'world2_level3',
            'world2_level3': 'world2_level4',
            'world2_level4': 'world3_level1',
            'world3_level1': 'world3_level2',
            'world3_level2': 'world3_level3',
            'world3_level3': 'world3_level4'
        };
        
        const nextLevel = levelMap[this.currentLevelId];
        
        if (nextLevel) {
            // Check if next level is unlocked
            if (typeof gameStorage !== 'undefined' && !gameStorage.isLevelUnlocked(nextLevel)) {
                console.log('⚠ Next level locked:', nextLevel);
                this.startGame(this.currentLevelId); // Restart current level
            } else {
                this.startGame(nextLevel);
            }
        } else {
            // No more levels, restart from beginning
            console.log('✓ All levels completed!');
            this.startGame('world1_level1');
        }
    }

    hideAllScreens() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('level-complete-screen').classList.add('hidden');
    }

    update(deltaTime) {
        if (this.state !== 'playing') return;

        // Update timer
        this.timeAccumulator += deltaTime;
        if (this.timeAccumulator >= 1000) {
            this.timeRemaining--;
            this.timeAccumulator = 0;
            if (this.timeRemaining <= 0) {
                this.gameOver();
                return;
            }
        }

        // Track jump statistics
        if (this.player.isJumping && !this.player.wasJumping) {
            this.stats.jumps++;
        }
        this.player.wasJumping = this.player.isJumping;

        this.player.update(deltaTime, this.physics, this.currentLevel.platforms);
        this.currentLevel.update(deltaTime, this.physics);

        // Coin collection
        this.currentLevel.coins.forEach(coin => {
            if (coin.active && Utils.checkCollision(this.player.getBounds(), coin.getBounds())) {
                coin.collect();
                this.player.collectCoin();
                this.score += 10;
                this.stats.coinsCollected++;
            }
        });

        // Crystal collection
        this.currentLevel.crystals.forEach(crystal => {
            if (crystal.active && Utils.checkCollision(this.player.getBounds(), crystal.getBounds())) {
                crystal.collect();
                this.score += 50;
            }
        });

        // Enemy collision
        this.currentLevel.enemies.forEach(enemy => {
            const collisionType = enemy.checkPlayerCollision(this.player);
            if (collisionType === 'stomp') {
                enemy.takeDamage();
                this.player.velocityY = -10;
                this.score += 20;
                this.stats.enemiesKilled++;
            } else if (collisionType === 'hit') {
                const isDead = this.player.takeDamage();
                if (isDead) {
                    this.stats.deaths++;
                    this.gameOver();
                }
            }
        });

        // Goal check
        if (this.currentLevel.checkGoalReached(this.player)) {
            this.levelComplete();
        }

        // Fall death
        if (this.player.y > this.currentLevel.height + 100) {
            const isDead = this.player.takeDamage();
            if (isDead) {
                this.stats.deaths++;
                this.gameOver();
            } else {
                this.player.reset();
            }
        }

        this.camera.update();
        this.parallax.update(this.camera.x, this.player.velocityX);
    }

    draw() {
        // Re-apply image smoothing settings (in case canvas was resized)
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.parallax.draw(this.ctx);

        if (this.currentLevel) {
            this.currentLevel.draw(this.ctx, this.camera);
        }

        if (this.player) {
            this.player.draw(this.ctx, this.camera);
        }

        this.updateUI();
    }

    updateUI() {
        document.getElementById('coins').textContent = `💎 ${this.player ? this.player.coins : 0}`;
        document.getElementById('lives').textContent = `❤️ ${this.player ? this.player.lives : 3}`;
        document.getElementById('time').textContent = `⏱️ ${this.timeRemaining}`;
    }

    gameLoop(currentTime = 0) {
        if (this.state !== 'playing') return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        const cappedDelta = Math.min(deltaTime, 100);

        this.update(cappedDelta);
        this.draw();

        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        soundSystem.stopMusic();
        
        // Hide and cleanup touch controls
        if (typeof touchControls !== 'undefined') {
            touchControls.hide();
        }
    }
}
