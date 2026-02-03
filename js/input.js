// Input Handler for Crystal Rush

class InputHandler {
    constructor() {
        this.keys = {};
        this.lastKey = '';
        
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;
            this.lastKey = key;
            
            // Prevent default for game keys
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
        });
        
        // Touch controls for mobile
        this.touch = {
            left: false,
            right: false,
            jump: false
        };
        
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        // Mobile touch controls would be added here
        // For now, keyboard only
    }
    
    isPressed(key) {
        return this.keys[key] || false;
    }
    
    // Movement checks
    isLeft() {
        return this.isPressed('arrowleft') || this.isPressed('a');
    }
    
    isRight() {
        return this.isPressed('arrowright') || this.isPressed('d');
    }
    
    isJump() {
        return this.isPressed(' ') || this.isPressed('w') || this.isPressed('arrowup');
    }
    
    isPause() {
        return this.isPressed('escape');
    }
    
    reset() {
        this.keys = {};
        this.lastKey = '';
    }
}

// Global input handler
const input = new InputHandler();