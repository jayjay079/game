// Main Entry Point for Crystal Rush

let game = null;

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Crystal Rush - Loading...');
    
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Create game instance
    game = new Game(canvas);
    
    console.log('✅ Crystal Rush - Ready to play!');
    console.log('🎯 Click "Start Game" to begin your adventure!');
});

// Handle page visibility (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (game && game.state === 'playing') {
        if (document.hidden) {
            game.pauseGame();
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (game) {
        game.stop();
    }
});

// Debug info (can be removed in production)
if (typeof console !== 'undefined') {
    console.log(`
    ╔═══════════════════════════════════╗
    ║      CRYSTAL RUSH - v1.0.0       ║
    ║                                   ║
    ║  🎮 Ein modernes Jump & Run      ║
    ║  🌟 Mit Parallax-Scrolling       ║
    ║  🎵 Prozeduralem Sound-System    ║
    ║                                   ║
    ║  Steuerung:                       ║
    ║  ← → oder A D: Bewegung          ║
    ║  Leertaste oder W: Springen      ║
    ║  ESC: Pause                       ║
    ║                                   ║
    ║  Viel Spaß! 🚀                    ║
    ╚═══════════════════════════════════╝
    `);
}