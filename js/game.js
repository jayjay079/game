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
        this.ctx = canvas.getContext('2d');
        this.width = 1200;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Game systems
        this.physics = new PhysicsEngine();
        this.parallax = new ParallaxSystem(this.canvas);
        this.camera = new Camera(this.width, this.height);
        this.levelManager = new LevelManager();

        // Game state
        this.state = 'menu';
        this.player = null;
        this.currentLevel = null;

        // Game stats
        this.score = 0;
        this.timeRemaining = 300;
        this.timeAccumulator = 0;

        // Animation
        this.lastTime = 0;
        this.animationId = null;

        // Setup
        this.setupParallax();
        this.setupEventListeners();
    }

    setupParallax() {
        // Sky background
        const skyLayer = new ParallaxLayer(
            'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)',
            0
        );
        this.parallax.addLayer(skyLayer);

        // Use real image layers - hochauflösende Grafiken!
        this.parallax.addLayer(new ParallaxImageLayer('bg_mountains', 0.1, 100));
        this.parallax.addLayer(new ParallaxImageLayer('bg_hills', 0.3, 200));
        this.parallax.addLayer(new ParallaxImageLayer('bg_clouds', 0.2, 50));
        this.parallax.addLayer(new ParallaxImageLayer('bg_trees', 0.7, 400));
        
        console.log('✓ Parallax mit echten Bildern initialisiert!');
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

    startGame() {
        this.state = 'playing';
        this.score = 0;
        
        this.currentLevel = this.levelManager.loadLevel('world1_level1');
        this.timeRemaining = this.currentLevel.timeLimit;
        this.timeAccumulator = 0;

        this.player = new Player(this.currentLevel.startX, this.currentLevel.startY);
        this.camera.follow(this.player);
        this.camera.setBounds(0, this.currentLevel.width, 0, this.currentLevel.height);

        this.hideAllScreens();
        soundSystem.startMusic();

        this.lastTime = performance.now();
        this.gameLoop();
    }

    pauseGame() {
        this.state = 'paused';
        document.getElementById('pause-screen').classList.remove('hidden');
        soundSystem.stopMusic();
    }

    resumeGame() {
        this.state = 'playing';
        document.getElementById('pause-screen').classList.add('hidden');
        soundSystem.startMusic();
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameOver() {
        this.state = 'gameover';
        document.getElementById('final-score').textContent = `Score: ${this.score} | Coins: ${this.player.coins}`;
        document.getElementById('gameover-screen').classList.remove('hidden');
        soundSystem.stopMusic();
        soundSystem.playGameOver();
    }

    levelComplete() {
        this.state = 'levelcomplete';
        const timeBonus = Math.floor(this.timeRemaining * 10);
        this.score += timeBonus;
        
        document.getElementById('level-stats').innerHTML = `
            <p>Coins: ${this.player.coins}</p>
            <p>Time Bonus: ${timeBonus}</p>
            <p>Total Score: ${this.score}</p>
        `;
        document.getElementById('level-complete-screen').classList.remove('hidden');
        soundSystem.stopMusic();
        soundSystem.playLevelComplete();
    }

    loadNextLevel() {
        this.startGame();
    }

    hideAllScreens() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('gameover-screen').classList.add('hidden');
        document.getElementById('level-complete-screen').classList.add('hidden');
    }

    update(deltaTime) {
        if (this.state !== 'playing') return;

        this.timeAccumulator += deltaTime;
        if (this.timeAccumulator >= 1000) {
            this.timeRemaining--;
            this.timeAccumulator = 0;
            if (this.timeRemaining <= 0) {
                this.gameOver();
                return;
            }
        }

        this.player.update(deltaTime, this.physics, this.currentLevel.platforms);
        this.currentLevel.update(deltaTime, this.physics);

        this.currentLevel.coins.forEach(coin => {
            if (coin.active && Utils.checkCollision(this.player.getBounds(), coin.getBounds())) {
                coin.collect();
                this.player.collectCoin();
                this.score += 10;
            }
        });

        this.currentLevel.crystals.forEach(crystal => {
            if (crystal.active && Utils.checkCollision(this.player.getBounds(), crystal.getBounds())) {
                crystal.collect();
                this.score += 50;
            }
        });

        this.currentLevel.enemies.forEach(enemy => {
            const collisionType = enemy.checkPlayerCollision(this.player);
            if (collisionType === 'stomp') {
                enemy.takeDamage();
                this.player.velocityY = -10;
                this.score += 20;
            } else if (collisionType === 'hit') {
                const isDead = this.player.takeDamage();
                if (isDead) this.gameOver();
            }
        });

        if (this.currentLevel.checkGoalReached(this.player)) {
            this.levelComplete();
        }

        if (this.player.y > this.currentLevel.height + 100) {
            const isDead = this.player.takeDamage();
            if (isDead) {
                this.gameOver();
            } else {
                this.player.reset();
            }
        }

        this.camera.update();
        this.parallax.update(this.camera.x, this.player.velocityX);
    }

    draw() {
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
    }
}