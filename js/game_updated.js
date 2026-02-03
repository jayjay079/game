// Updated setupParallax() method for Game class
// Replace the setupParallax() method in game.js with this:

/*
setupParallax() {
    // Sky background (gradient)
    const skyLayer = new ParallaxLayer(
        'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)',
        0
    );
    this.parallax.addLayer(skyLayer);

    // Use real image layers
    this.parallax.addLayer(new ParallaxImageLayer('bg_mountains', 0.1, 100));
    this.parallax.addLayer(new ParallaxImageLayer('bg_hills', 0.3, 200));
    this.parallax.addLayer(new ParallaxImageLayer('bg_clouds', 0.2, 50));
    this.parallax.addLayer(new ParallaxImageLayer('bg_trees', 0.7, 400));
    
    console.log('✓ Parallax with real images initialized!');
}
*/

// To apply this change:
// 1. Open js/game.js
// 2. Find the setupParallax() method (around line 73)
// 3. Replace the entire method with the code above
// 4. Save the file

// The new version uses ParallaxImageLayer instead of procedural shapes,
// loading the hochauflösende Grafiken from the asset loader!