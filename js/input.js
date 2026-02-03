// Input Handler for Crystal Rush
// Supports both keyboard and touch controls

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
    }
    
    isPressed(key) {
        return this.keys[key] || false;
    }
    
    // Movement checks (combines keyboard + touch)
    isLeft() {
        const keyboard = this.isPressed('arrowleft') || this.isPressed('a');
        const touch = (typeof touchControls !== 'undefined' && touchControls.enabled) ? touchControls.left : false;
        return keyboard || touch;
    }
    
    isRight() {
        const keyboard = this.isPressed('arrowright') || this.isPressed('d');
        const touch = (typeof touchControls !== 'undefined' && touchControls.enabled) ? touchControls.right : false;
        return keyboard || touch;
    }
    
    isJump() {
        const keyboard = this.isPressed(' ') || this.isPressed('w') || this.isPressed('arrowup');
        const touch = (typeof touchControls !== 'undefined' && touchControls.enabled) ? touchControls.jump : false;
        return keyboard || touch;
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
