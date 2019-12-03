// ---- definition ------------------------------------------------------------

// -- common ----

/**
 * Converts a `p5.Color` instance to an object representation.
 * @param p5Color
 * @returns `{ r, g, b }`
 */
const colorToRGB = p5Color => {
  return {
    r: red(p5Color),
    g: green(p5Color),
    b: blue(p5Color)
  };
};

/**
 * Converts a `p5.Color` instance to an object representation.
 * @param p5Color
 * @returns  `{ r, g, b, a }`
 */
const colorToRGBA = p5Color => {
  return {
    r: red(p5Color),
    g: green(p5Color),
    b: blue(p5Color),
    a: alpha(p5Color)
  };
};

// -- pixels ----

/**
 * Creates a function for setting color to the specified point.
 * Should be used in conjunction with loadPixels() and updatePixels().
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param logicalX - The logical x index of the point.
 * @param logicalY - The logical y index of the point.
 * @param red - The red value (0 - 255).
 * @param green - The green value (0 - 255).
 * @param blue - The blue value (0 - 255).
 * @param alpha - The alpha value (0 - 255).
 */
const createSetPixel = renderer => {
  const density = renderer.pixelDensity();
  const pixelWidth = renderer.width * density;
  const { pixels } = renderer;

  return (logicalX, logicalY, red, green, blue, alpha) => {
    // physical X
    const startX = logicalX * density;
    const endX = startX + density;

    // physical Y
    const startY = logicalY * density;
    const endY = startY + density;

    for (let y = startY; y < endY; y += 1) {
      const pixelIndexAtX0 = y * pixelWidth;

      for (let x = startX; x < endX; x += 1) {
        const valueIndex = 4 * (pixelIndexAtX0 + x);
        pixels[valueIndex] = red;
        pixels[valueIndex + 1] = green;
        pixels[valueIndex + 2] = blue;
        pixels[valueIndex + 3] = alpha;
      }
    }
  };
};

/**
 * Creates a function for setting color to the specified row of pixels.
 * Should be used in conjunction with loadPixels() and updatePixels().
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param logicalY - The logical y index of the pixel row.
 * @param red - The red value (0 - 255).
 * @param green - The green value (0 - 255).
 * @param blue - The blue value (0 - 255).
 * @param alpha - The alpha value (0 - 255).
 */
const createSetPixelRow = renderer => {
  const density = renderer.pixelDensity();
  const pixelWidth = renderer.width * density;
  const { pixels } = renderer;

  return (logicalY, red, green, blue, alpha) => {
    // physical Y
    const startY = logicalY * density;
    const endY = startY + density;

    for (let y = startY; y < endY; y += 1) {
      const pixelIndexAtX0 = y * pixelWidth;

      for (let x = 0; x < pixelWidth; x += 1) {
        const valueIndex = 4 * (pixelIndexAtX0 + x);
        pixels[valueIndex] = red;
        pixels[valueIndex + 1] = green;
        pixels[valueIndex + 2] = blue;
        pixels[valueIndex + 3] = alpha;
      }
    }
  };
};

// -- generic texture ----

/**
 * Draws texture on `renderer` by applying `runSetPixel` to each coordinate.
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param runSetPixel - A function that takes `setPixel`, `x`, `y` as arguments and internally runs `setPixel`.
 */
const drawTexture = (renderer, runSetPixel) => {
  const { width, height } = renderer;

  renderer.loadPixels();
  const setPixel = createSetPixel(renderer);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      runSetPixel(setPixel, x, y);
    }
  }

  renderer.updatePixels();
};

/**
 * Creates a texture by applying `runSetPixel` to each coordinate of a new `p5.Graphics` instance.
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param runSetPixel - A function that takes `setPixel`, `x`, `y` as arguments and internally runs `setPixel`.
 * @returns New `p5.Graphics` instance.
 */
const createTexture = (width, height, runSetPixel) => {
  const graphics = createGraphics(width, height);
  drawTexture(graphics, runSetPixel);

  return graphics;
};

/**
 * Draws texture on `renderer` by applying `runSetPixelRow` to each y coordinate.
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param runSetPixelRow - A function that takes `setPixelRow` and `y` as arguments and internally runs `setPixel`.
 */
const drawTextureRowByRow = (renderer, runSetPixelRow) => {
  const { height } = renderer;

  renderer.loadPixels();
  const setPixelRow = createSetPixelRow(renderer);

  for (let y = 0; y < height; y += 1) runSetPixelRow(setPixelRow, y);

  renderer.updatePixels();
};

/**
 * Creates a texture by applying `runSetPixelRow` to each y coordinate of a new `p5.Graphics` instance..
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param runSetPixelRow - A function that takes `setPixelRow` and `y` as arguments and internally runs `setPixel`.
 * @returns New `p5.Graphics` instance.
 */
const createTextureRowByRow = (width, height, runSetPixelRow) => {
  const graphics = createGraphics(width, height);
  drawTextureRowByRow(graphics, runSetPixelRow);
  return graphics;
};

// -- particular textures ----

const createRandomTexture = parameters => {
  const { width, height, color, maxAlphaFactor } = parameters;

  const maxAlpha = maxAlphaFactor * 255;
  const { r, g, b } = colorToRGB(color);

  const runSetPixel = (setPixel, x, y) =>
    setPixel(x, y, r, g, b, Math.random() * maxAlpha);

  return createTexture(width, height, runSetPixel);
};

const createNoiseTexture = parameters => {
  const { width, height, color, maxAlphaFactor, noiseScale } = parameters;

  const maxAlpha = maxAlphaFactor * 255;
  const { r, g, b } = colorToRGB(color);

  const runSetPixel = (setPixel, x, y) =>
    setPixel(x, y, r, g, b, noise(x * noiseScale, y * noiseScale) * maxAlpha);

  return createTexture(width, height, runSetPixel);
};

const createGradationTexture = parameters => {
  const { width, height, fromColor, toColor, gradient } = parameters;
  const maxY = height - 1;

  const runSetPixelRow = (setPixelRow, y) => {
    const rowColor = lerpColor(
      fromColor,
      toColor,
      Math.pow(y / maxY, gradient)
    );
    const { r, g, b, a } = colorToRGBA(rowColor);
    setPixelRow(y, r, g, b, a);
  };

  return createTextureRowByRow(width, height, runSetPixelRow);
};

// ---- example ---------------------------------------------------------------

// -- functions ----

const drawRandomTexture = () => {
  background(255);
  const graphics = createRandomTexture({
    width,
    height,
    color: color(0),
    maxAlphaFactor: 0.2
  });
  image(graphics, 0, 0);
};

const drawNoiseTexture = () => {
  background(255);
  const graphics = createNoiseTexture({
    width,
    height,
    color: color(0),
    maxAlphaFactor: 0.3,
    noiseScale: 0.01
  });
  image(graphics, 0, 0);
};

const drawGradationTexture = () => {
  background(255);
  const graphics = createGradationTexture({
    width,
    height,
    fromColor: color(255, 0),
    toColor: color(0, 128, 255, 32),
    gradient: 3
  });
  image(graphics, 0, 0);
};

// -- main ----

function setup() {
  createCanvas(640, 480);

  drawRandomTexture();
}

function draw() {
  switch (frameCount % 180) {
    case 0:
      drawRandomTexture();
      break;
    case 60:
      drawNoiseTexture();
      break;
    case 120:
      drawGradationTexture();
      break;
  }
}
