// Mobile Touch Controls for Crystal Rush
// Provides virtual joystick and buttons for mobile devices

class TouchControls {
    constructor() {
        this.enabled = false;
        this.isMobile = this.detectMobile();
        this.joystick = null;
        this.buttons = {};
        this.touches = {};
        this.initialized = false;
        
        // Control states (compatible with keyboard input)
        this.left = false;
        this.right = false;
        this.jump = false;
    }

    /**
     * Initialize touch controls (called from game.js)
     */
    init() {
        if (this.initialized) return;
        
        if (this.isMobile) {
            this.createUI();
            this.setupEventListeners();
            this.initialized = true;
            console.log('✅ Touch controls initialized');
        } else {
            console.log('⚠ Desktop mode - touch controls skipped');
        }
    }

    /**
     * Detect if device is mobile
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }

    /**
     * Create touch control UI
     */
    createUI() {
        // Container for all touch controls
        const container = document.createElement('div');
        container.id = 'touch-controls';
        container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 200px;
            pointer-events: none;
            z-index: 1000;
            display: none;
        `;

        // Left joystick area
        const joystickArea = document.createElement('div');
        joystickArea.id = 'joystick-area';
        joystickArea.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 120px;
            height: 120px;
            pointer-events: all;
        `;

        // Joystick base
        const joystickBase = document.createElement('div');
        joystickBase.style.cssText = `
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            border: 3px solid rgba(255, 255, 255, 0.4);
        `;

        // Joystick stick
        const joystickStick = document.createElement('div');
        joystickStick.id = 'joystick-stick';
        joystickStick.style.cssText = `
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            border: 2px solid rgba(255, 255, 255, 0.8);
            top: 35px;
            left: 35px;
            transition: all 0.1s ease;
        `;

        joystickBase.appendChild(joystickStick);
        joystickArea.appendChild(joystickBase);
        container.appendChild(joystickArea);

        // Jump button (right side)
        const jumpButton = document.createElement('button');
        jumpButton.id = 'touch-jump';
        jumpButton.innerHTML = '↑';
        jumpButton.style.cssText = `
            position: absolute;
            bottom: 40px;
            right: 30px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.7);
            border: 3px solid rgba(255, 255, 255, 0.8);
            color: white;
            font-size: 32px;
            font-weight: bold;
            pointer-events: all;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        `;

        container.appendChild(jumpButton);

        // Add to DOM
        document.body.appendChild(container);

        // Store references
        this.ui = {
            container,
            joystickArea,
            joystickStick,
            jumpButton
        };

        console.log('🕹️ Touch controls UI created');
    }

    /**
     * Setup touch event listeners
     */
    setupEventListeners() {
        if (!this.ui) return;

        // Joystick events
        this.ui.joystickArea.addEventListener('touchstart', (e) => this.handleJoystickStart(e));
        this.ui.joystickArea.addEventListener('touchmove', (e) => this.handleJoystickMove(e));
        this.ui.joystickArea.addEventListener('touchend', (e) => this.handleJoystickEnd(e));

        // Jump button events
        this.ui.jumpButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.jump = true;
            this.ui.jumpButton.style.background = 'rgba(102, 126, 234, 1)';
            this.ui.jumpButton.style.transform = 'scale(0.95)';
        });

        this.ui.jumpButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.jump = false;
            this.ui.jumpButton.style.background = 'rgba(102, 126, 234, 0.7)';
            this.ui.jumpButton.style.transform = 'scale(1)';
        });

        console.log('✅ Touch event listeners setup');
    }

    /**
     * Handle joystick touch start
     */
    handleJoystickStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.touches.joystick = touch.identifier;
        this.updateJoystick(touch);
    }

    /**
     * Handle joystick touch move
     */
    handleJoystickMove(e) {
        e.preventDefault();
        const touch = Array.from(e.touches).find(t => t.identifier === this.touches.joystick);
        if (touch) {
            this.updateJoystick(touch);
        }
    }

    /**
     * Handle joystick touch end
     */
    handleJoystickEnd(e) {
        e.preventDefault();
        this.touches.joystick = null;
        this.resetJoystick();
    }

    /**
     * Update joystick position and states
     */
    updateJoystick(touch) {
        const rect = this.ui.joystickArea.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;

        // Limit to base radius
        const maxDistance = 35;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > maxDistance) {
            deltaX = (deltaX / distance) * maxDistance;
            deltaY = (deltaY / distance) * maxDistance;
        }

        // Update stick visual position
        this.ui.joystickStick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        // Update control states
        const threshold = 15;
        this.left = deltaX < -threshold;
        this.right = deltaX > threshold;

        // Debug
        // console.log(`Joystick: ${this.left ? 'LEFT' : ''} ${this.right ? 'RIGHT' : ''}`);
    }

    /**
     * Reset joystick to center
     */
    resetJoystick() {
        if (!this.ui) return;
        this.ui.joystickStick.style.transform = 'translate(0, 0)';
        this.left = false;
        this.right = false;
    }

    /**
     * Show touch controls (alias for enable)
     */
    show() {
        this.enable();
    }

    /**
     * Hide touch controls (alias for disable)
     */
    hide() {
        this.disable();
    }

    /**
     * Enable touch controls
     */
    enable() {
        if (!this.isMobile || !this.ui) return;
        this.enabled = true;
        this.ui.container.style.display = 'block';
        console.log('✅ Touch controls enabled');
    }

    /**
     * Disable touch controls
     */
    disable() {
        if (!this.ui) return;
        this.enabled = false;
        this.ui.container.style.display = 'none';
        this.resetJoystick();
        this.jump = false;
        console.log('❌ Touch controls disabled');
    }

    /**
     * Toggle touch controls
     */
    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    /**
     * Get current control states
     */
    getState() {
        return {
            left: this.left,
            right: this.right,
            jump: this.jump,
            enabled: this.enabled
        };
    }

    /**
     * Check if any touch control is active
     */
    isActive() {
        return this.enabled && (this.left || this.right || this.jump);
    }
}

// Create global instance
const touchControls = new TouchControls();

// Auto-enable on mobile
if (touchControls.isMobile) {
    console.log('📱 Mobile device detected');
    // Will be enabled when game starts
}

// Debug
if (typeof console !== 'undefined') {
    console.log('🎮 TouchControls initialized');
    window.debugTouch = {
        enable: () => touchControls.enable(),
        disable: () => touchControls.disable(),
        state: () => console.log(touchControls.getState())
    };
}
