// Main Entry Point for Crystal Rush

let game = null;

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Crystal Rush - Loading...');
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Show loading screen
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    
    // Load assets with progress tracking
    const progressInterval = setInterval(() => {
        const progress = assetLoader.getProgress();
        if (loadingProgress && loadingText) {
            loadingProgress.style.width = progress + '%';
            loadingText.textContent = Math.floor(progress) + '%';
        }
    }, 100);
    
    try {
        // Load all graphics
        await assetLoader.loadAssets();
        clearInterval(progressInterval);
        
        // Update progress to 100%
        if (loadingProgress && loadingText) {
            loadingProgress.style.width = '100%';
            loadingText.textContent = '100%';
        }
        
        // Hide loading screen, show start screen
        setTimeout(() => {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            const startScreen = document.getElementById('start-screen');
            if (startScreen) startScreen.classList.remove('hidden');
        }, 500);
        
        // Create game instance
        game = new Game(canvas);
        
        console.log('✅ Crystal Rush - Ready to play!');
        console.log('🎯 Click "Start Game" to begin your adventure!');
    } catch (error) {
        console.error('Failed to load assets:', error);
        if (loadingText) {
            loadingText.textContent = 'Fehler beim Laden!';
            loadingText.style.color = 'red';
        }
    }
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

// Debug info
if (typeof console !== 'undefined') {
    console.log(`
    ╔═══════════════════════════════════╗
    ║      CRYSTAL RUSH - v1.0.0       ║
    ║                                   ║
    ║  🎮 Hochauflösende Grafiken    ║
    ║  🌟 Parallax-Scrolling          ║
    ║  🎵 Prozedurales Sound           ║
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