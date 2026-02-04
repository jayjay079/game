#!/bin/bash
# Download high-resolution game assets from S3
# Crystal Rush - Asset Download Script
# Updated: February 4, 2026

echo "Crystal Rush - Asset Downloader"
echo "================================="
echo ""

# Create directories
mkdir -p assets/sprites
mkdir -p assets/backgrounds

echo "Directories created"
echo ""

# Download character sprite sheet
echo "Downloading character.png (2048x512px)..."
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/a80a9e2f-93d3-4f1d-a699-2e00423be846.png" \
  -o "assets/sprites/character.png"

if [ $? -eq 0 ]; then
    echo "character.png downloaded"
else
    echo "Failed to download character.png"
fi

echo ""

# Download enemy sprite sheet
echo "Downloading enemies.png (2048x512px)..."
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/6cba49c1-cc0a-4e61-9fee-70defc7ce5e9.png" \
  -o "assets/sprites/enemies.png"

if [ $? -eq 0 ]; then
    echo "enemies.png downloaded"
else
    echo "Failed to download enemies.png"
fi

echo ""

# Download items sprite sheet
echo "Downloading items.png (1024x512px)..."
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/e1c336e9-fd97-4478-9ff6-f559348d6598.png" \
  -o "assets/sprites/items.png"

if [ $? -eq 0 ]; then
    echo "items.png downloaded"
else
    echo "Failed to download items.png"
fi

echo ""

# Download tileset
echo "Downloading tileset.png (1024x1024px)..."
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/38320c76-644b-40a7-b447-205df89e4fd2.png" \
  -o "assets/sprites/tileset.png"

if [ $? -eq 0 ]; then
    echo "tileset.png downloaded"
else
    echo "Failed to download tileset.png"
fi

echo ""

# Download background layers
echo "Downloading mountains.png (2048x600px)..."
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/6a10110f-e5db-4030-a3e1-f2679fb8e9db.png" \
  -o "assets/backgrounds/mountains.png"

if [ $? -eq 0 ]; then
    echo "mountains.png downloaded"
else
    echo "Failed to download mountains.png"
fi

echo ""

echo "Downloading hills.png (2048x600px)..."
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/de65c130-14cd-474e-a48b-c786c7bdf767.png" \
  -o "assets/backgrounds/hills.png"

if [ $? -eq 0 ]; then
    echo "hills.png downloaded"
else
    echo "Failed to download hills.png"
fi

echo ""

echo "Downloading clouds.png (2048x400px)..."
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/98c66ab9-d96a-4121-96e9-d9f25d345e14.png" \
  -o "assets/backgrounds/clouds.png"

if [ $? -eq 0 ]; then
    echo "clouds.png downloaded"
else
    echo "Failed to download clouds.png"
fi

echo ""

echo "Downloading trees.png (2048x800px)..."
curl -L "https://user-gen-media-assets.s3.amazonaws.com/seedream_images/b5446f38-d28b-4988-b0f1-e8a87a1bf589.png" \
  -o "assets/backgrounds/trees.png"

if [ $? -eq 0 ]; then
    echo "trees.png downloaded"
else
    echo "Failed to download trees.png"
fi

echo ""
echo "================================="
echo "Asset download complete!"
echo ""
echo "Asset Summary:"
echo "  - Character: 2048x512px (8 frames)"
echo "  - Enemies: 2048x512px (16 frames)"
echo "  - Items: 1024x512px (32 items)"
echo "  - Tileset: 1024x1024px (64 tiles)"
echo "  - Mountains: 2048x600px (seamless)"
echo "  - Hills: 2048x600px (seamless)"
echo "  - Clouds: 2048x400px (transparent)"
echo "  - Trees: 2048x800px (semi-transparent)"
echo ""
echo "Ready to play! Start your local server:"
echo "   python -m http.server 8000"
echo "   or: npx serve"
echo ""
