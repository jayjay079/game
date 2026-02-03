// LocalStorage System for Crystal Rush
// Handles saving/loading of game progress, highscores, and settings

class GameStorage {
    constructor() {
        this.storageKey = 'crystalRush';
        this.defaultData = {
            version: '1.1.0',
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                touchControlsEnabled: true
            },
            progress: {
                unlockedWorlds: [1], // World 1 unlocked by default
                unlockedLevels: ['world1_level1'], // First level unlocked
                completedLevels: [],
                collectedCrystals: 0,
                totalCoins: 0
            },
            highscores: {
                world1_level1: { score: 0, time: 0, coins: 0 },
                world1_level2: { score: 0, time: 0, coins: 0 },
                world1_level3: { score: 0, time: 0, coins: 0 },
                world1_level4: { score: 0, time: 0, coins: 0 },
                world2_level1: { score: 0, time: 0, coins: 0 },
                world2_level2: { score: 0, time: 0, coins: 0 },
                world2_level3: { score: 0, time: 0, coins: 0 },
                world2_level4: { score: 0, time: 0, coins: 0 },
                world3_level1: { score: 0, time: 0, coins: 0 },
                world3_level2: { score: 0, time: 0, coins: 0 },
                world3_level3: { score: 0, time: 0, coins: 0 },
                world3_level4: { score: 0, time: 0, coins: 0 }
            },
            stats: {
                totalPlaytime: 0,
                totalDeaths: 0,
                totalJumps: 0,
                enemiesDefeated: 0,
                firstPlayDate: null,
                lastPlayDate: null
            }
        };
    }

    /**
     * Initialize storage (load or create)
     */
    init() {
        if (!this.isAvailable()) {
            console.warn('⚠️ LocalStorage not available - progress will not be saved');
            return false;
        }

        const data = this.load();
        if (!data) {
            console.log('🆕 Creating new save data');
            this.save(this.defaultData);
        } else {
            console.log('✅ Save data loaded');
            // Migration if needed
            this.migrate(data);
        }
        return true;
    }

    /**
     * Check if LocalStorage is available
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Load all game data
     */
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('❌ Failed to load save data:', e);
            return null;
        }
    }

    /**
     * Save all game data
     */
    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('❌ Failed to save data:', e);
            return false;
        }
    }

    /**
     * Update progress after level completion
     */
    updateProgress(levelId, score, time, coins) {
        const data = this.load() || this.defaultData;
        
        // Update highscore if better
        if (!data.highscores[levelId] || score > data.highscores[levelId].score) {
            data.highscores[levelId] = { score, time, coins };
            console.log(`🏆 New highscore for ${levelId}: ${score}`);
        }

        // Mark level as completed
        if (!data.progress.completedLevels.includes(levelId)) {
            data.progress.completedLevels.push(levelId);
        }

        // Unlock next level
        const nextLevel = this.getNextLevel(levelId);
        if (nextLevel && !data.progress.unlockedLevels.includes(nextLevel)) {
            data.progress.unlockedLevels.push(nextLevel);
            console.log(`🔓 Unlocked: ${nextLevel}`);
        }

        // Unlock next world if last level of world completed
        const worldNum = parseInt(levelId.match(/world(\d+)/)[1]);
        const levelNum = parseInt(levelId.match(/level(\d+)/)[1]);
        if (levelNum === 4 && !data.progress.unlockedWorlds.includes(worldNum + 1)) {
            data.progress.unlockedWorlds.push(worldNum + 1);
            console.log(`🌍 Unlocked World ${worldNum + 1}!`);
        }

        // Update stats
        data.progress.totalCoins += coins;
        data.stats.lastPlayDate = new Date().toISOString();
        if (!data.stats.firstPlayDate) {
            data.stats.firstPlayDate = new Date().toISOString();
        }

        this.save(data);
        return data;
    }

    /**
     * Update statistics
     */
    updateStats(stats) {
        const data = this.load() || this.defaultData;
        Object.assign(data.stats, stats);
        this.save(data);
    }

    /**
     * Get next level ID
     */
    getNextLevel(currentLevelId) {
        const match = currentLevelId.match(/world(\d+)_level(\d+)/);
        if (!match) return null;
        
        const worldNum = parseInt(match[1]);
        const levelNum = parseInt(match[2]);
        
        // Next level in same world
        if (levelNum < 4) {
            return `world${worldNum}_level${levelNum + 1}`;
        }
        
        // First level of next world
        if (worldNum < 3) {
            return `world${worldNum + 1}_level1`;
        }
        
        return null; // Game completed!
    }

    /**
     * Check if level is unlocked
     */
    isLevelUnlocked(levelId) {
        const data = this.load();
        return data && data.progress.unlockedLevels.includes(levelId);
    }

    /**
     * Check if world is unlocked
     */
    isWorldUnlocked(worldNum) {
        const data = this.load();
        return data && data.progress.unlockedWorlds.includes(worldNum);
    }

    /**
     * Get highscore for level
     */
    getHighscore(levelId) {
        const data = this.load();
        return data && data.highscores[levelId] ? data.highscores[levelId] : null;
    }

    /**
     * Get all highscores
     */
    getAllHighscores() {
        const data = this.load();
        return data ? data.highscores : {};
    }

    /**
     * Get progress data
     */
    getProgress() {
        const data = this.load();
        return data ? data.progress : this.defaultData.progress;
    }

    /**
     * Get statistics
     */
    getStats() {
        const data = this.load();
        return data ? data.stats : this.defaultData.stats;
    }

    /**
     * Get settings
     */
    getSettings() {
        const data = this.load();
        return data ? data.settings : this.defaultData.settings;
    }

    /**
     * Update settings
     */
    updateSettings(newSettings) {
        const data = this.load() || this.defaultData;
        Object.assign(data.settings, newSettings);
        this.save(data);
    }

    /**
     * Reset all progress (keep settings)
     */
    resetProgress() {
        const data = this.load() || this.defaultData;
        const settings = data.settings;
        const fresh = JSON.parse(JSON.stringify(this.defaultData));
        fresh.settings = settings;
        this.save(fresh);
        console.log('🔄 Progress reset');
    }

    /**
     * Delete all data
     */
    clearAll() {
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ All data cleared');
    }

    /**
     * Export save data as JSON
     */
    exportData() {
        const data = this.load();
        return JSON.stringify(data, null, 2);
    }

    /**
     * Import save data from JSON
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.save(data);
            console.log('✅ Data imported successfully');
            return true;
        } catch (e) {
            console.error('❌ Failed to import data:', e);
            return false;
        }
    }

    /**
     * Migrate old save data to new version
     */
    migrate(data) {
        // Check version and migrate if needed
        if (!data.version || data.version !== this.defaultData.version) {
            console.log('🔄 Migrating save data...');
            // Add missing fields
            Object.keys(this.defaultData).forEach(key => {
                if (!data[key]) {
                    data[key] = this.defaultData[key];
                }
            });
            data.version = this.defaultData.version;
            this.save(data);
        }
    }
}

// Create global instance
const gameStorage = new GameStorage();

// Debug helpers
if (typeof console !== 'undefined') {
    console.log('💾 GameStorage initialized');
    // Expose debug functions
    window.debugStorage = {
        view: () => console.log(gameStorage.load()),
        reset: () => gameStorage.resetProgress(),
        clear: () => gameStorage.clearAll(),
        export: () => console.log(gameStorage.exportData())
    };
}
