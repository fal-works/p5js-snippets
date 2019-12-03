// ---- definition ------------------------------------------------------------

/**
 * Stores the current canvas pixels and returns a function that restores them.
 * @param renderer - Instance of either p5 or p5.Graphics. Defaults to `window`
 *   for use in p5.js global mode.
 * @returns A function that restores the canvas pixels.
 */
const storePixels = (renderer = window) => {
  renderer.loadPixels();
  const storedPixels = renderer.pixels;

  return () => {
    renderer.pixels = storedPixels;
    renderer.updatePixels();
  };
};

// ---- example ---------------------------------------------------------------

let restorePixels;

function setup() {
  createCanvas(640, 480);

  rectMode(CENTER);

  background(255);
  noStroke();
  fill(32, 0, 255, 16);

  for (let i = 0; i < 100; i += 1) {
    rect(random(width), random(height), 100, 20);
    rect(random(width), random(height), 20, 100);
  }

  restorePixels = storePixels();

  stroke(0, 160);
  noFill();
  strokeWeight(10);
}

function draw() {
  restorePixels();

  square(width / 2, height / 2, 300 + 100 * Math.sin(frameCount * 0.1));
}
