// Asset Management System for Crystal Rush

class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = 0;
        this.total = 0;
    }

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
                    console.log('🎉 All assets loaded!');
                }
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`✗ Failed: ${name}`);
                this.loaded++;
                resolve(null);
            };
            img.src = url;
        });
    }

    async loadAssets() {
        const assets = [
            { name: 'character', url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/fa44d568-0299-47bd-ae9a-df62953fcc7d.png' },
            { name: 'enemies', url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/bf3bf5c5-b432-4cf5-98a0-3ec2177ddc58.png' },
            { name: 'items', url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/1523642d-8b01-4138-b6f1-4d6a67778974.png' },
            { name: 'tileset', url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/f0b5fa87-097c-4351-af8b-f8ce910af243.png' },
            { name: 'bg_mountains', url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/772c6f02-d4ed-4230-9ce5-d0a0170acd7c.png' },
            { name: 'bg_hills', url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/4559f7a6-be83-4e06-93c3-fe20966985b9.png' },
            { name: 'bg_clouds', url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/5d729062-9767-4c3f-9084-3b09f7c55d8b.png' },
            { name: 'bg_trees', url: 'https://user-gen-media-assets.s3.amazonaws.com/seedream_images/59e53348-3c06-4a27-b894-627d7cee7863.png' }
        ];
        await Promise.all(assets.map(a => this.loadImage(a.name, a.url)));
    }

    get(name) { return this.images[name] || null; }
    getProgress() { return this.total > 0 ? (this.loaded / this.total) * 100 : 0; }
}

const assetLoader = new AssetLoader();