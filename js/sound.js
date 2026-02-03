// Sound System for Crystal Rush

class SoundSystem {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.enabled = true;
        this.currentMusic = null;
        
        // Audio Context for better browser compatibility
        this.audioContext = null;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    // Generate procedural sound using Web Audio API
    createSound(type, frequency = 440, duration = 0.2) {
        if (!this.audioContext || !this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        // Envelope
        gainNode.gain.setValueAtTime(this.sfxVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Play jump sound
    playJump() {
        if (!this.enabled) return;
        this.createSound('sine', 400, 0.1);
        setTimeout(() => this.createSound('sine', 600, 0.1), 50);
    }

    // Play coin collect sound
    playCoin() {
        if (!this.enabled) return;
        this.createSound('square', 800, 0.1);
        setTimeout(() => this.createSound('square', 1000, 0.1), 50);
        setTimeout(() => this.createSound('square', 1200, 0.1), 100);
    }

    // Play enemy hit sound
    playEnemyHit() {
        if (!this.enabled) return;
        this.createSound('sawtooth', 200, 0.15);
    }

    // Play player hurt sound
    playHurt() {
        if (!this.enabled) return;
        this.createSound('sawtooth', 150, 0.3);
        setTimeout(() => this.createSound('sawtooth', 100, 0.2), 100);
    }

    // Play level complete sound
    playLevelComplete() {
        if (!this.enabled) return;
        const notes = [523, 587, 659, 784, 880];
        notes.forEach((note, i) => {
            setTimeout(() => this.createSound('sine', note, 0.2), i * 100);
        });
    }

    // Play power-up sound
    playPowerUp() {
        if (!this.enabled) return;
        for (let i = 0; i < 8; i++) {
            setTimeout(() => this.createSound('sine', 400 + i * 100, 0.08), i * 50);
        }
    }

    // Play game over sound
    playGameOver() {
        if (!this.enabled) return;
        const notes = [400, 350, 300, 250, 200];
        notes.forEach((note, i) => {
            setTimeout(() => this.createSound('triangle', note, 0.3), i * 150);
        });
    }

    // Simple background music loop (procedural)
    startMusic() {
        if (!this.enabled || !this.audioContext) return;
        
        // Stop existing music
        this.stopMusic();
        
        // Simple melody loop
        const melody = [523, 587, 659, 587, 523, 440, 493, 523];
        let currentNote = 0;
        
        const playNextNote = () => {
            if (!this.enabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(melody[currentNote], this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(this.musicVolume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.4);
            
            currentNote = (currentNote + 1) % melody.length;
        };
        
        this.currentMusic = setInterval(playNextNote, 500);
    }

    stopMusic() {
        if (this.currentMusic) {
            clearInterval(this.currentMusic);
            this.currentMusic = null;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopMusic();
        }
        return this.enabled;
    }

    setMusicVolume(volume) {
        this.musicVolume = Utils.clamp(volume, 0, 1);
    }

    setSfxVolume(volume) {
        this.sfxVolume = Utils.clamp(volume, 0, 1);
    }
}

// Global sound system instance
const soundSystem = new SoundSystem();