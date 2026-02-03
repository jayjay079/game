// Asset Management System for Crystal Rush
// Handles loading and caching of all game graphics

class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = 0;
        this.total = 0;
    }

    /**
     * Load a single image
     * @param {string} name - Internal name for the asset
     * @param {string} url - URL to load from
     * @returns {Promise<Image>}
     */
    loadImage(name, url) {
        this.total++;
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                this.images[name] = img;
                this.loaded++;
                console.log(`✓ Loaded: ${name} (${this.loaded}/${this.total})`);
                
                if (this.loaded === this.total) {
                    console.log('🎉 All assets loaded successfully!');
                }
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`✗ Failed to load: ${name}`);
                this.loaded++;
                resolve(null);
            };
            
            img.src = url;
        });
    }

    /**
     * Load all game assets
     * @returns {Promise<void>}
     */
    async loadAssets() {
        console.log('📦 Starting asset loading...');
        
        const assets = [
            // Character sprite sheet
            {
                name: 'character',
                url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/fa44d568-0299-47bd-ae9a-df62953fcc7d.png'
            },
            // Enemy sprite sheet
            {
                name: 'enemies',
                url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/bf3bf5c5-b432-4cf5-98a0-3ec2177ddc58.png'
            },
            // Items & collectibles
            {
                name: 'items',
                url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/1523642d-8b01-4138-b6f1-4d6a67778974.png'
            },
            // Grassland tileset
            {
                name: 'tileset',
                url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/f0b5fa87-097c-4351-af8b-f8ce910af243.png'
            },
            // Parallax backgrounds
            {
                name: 'bg_mountains',
                url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/772c6f02-d4ed-4230-9ce5-d0a0170acd7c.png'
            },
            {
                name: 'bg_hills',
                url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4559f7a6-be83-4e06-93c3-fe20966985b9.png'
            },
            {
                name: 'bg_clouds',
                url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/5d729062-9767-4c3f-9084-3b09f7c55d8b.png'
            },
            {
                name: 'bg_trees',
                url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/59e53348-3c06-4a27-b894-627d7cee7863.png'
            }
        ];

        // Load all assets in parallel
        await Promise.all(assets.map(asset => this.loadImage(asset.name, asset.url)));
        
        console.log('✅ Asset loading complete!');
    }

    /**
     * Get a loaded image by name
     * @param {string} name - Asset name
     * @returns {Image|null}
     */
    get(name) {
        return this.images[name] || null;
    }

    /**
     * Get loading progress as percentage
     * @returns {number} - Progress 0-100
     */
    getProgress() {
        if (this.total === 0) return 0;
        return (this.loaded / this.total) * 100;
    }

    /**
     * Check if all assets are loaded
     * @returns {boolean}
     */
    isComplete() {
        return this.loaded === this.total && this.total > 0;
    }
}

// Create global instance
const assetLoader = new AssetLoader();

// Debug info
if (typeof console !== 'undefined') {
    console.log('🎨 Asset Loader initialized');
    console.log('Total assets to load: 8');
}