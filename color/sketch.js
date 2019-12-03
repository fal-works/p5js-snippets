// ---- definition ------------------------------------------------------------

const returnVoid = () => {};

/**
 * Creates a function that applies a stroke color.
 * @param colorValue - Either a `p5.Color` instance, a color code string
 *   (e.g. `"#FFFFFF"`), `null` or `undefined`.
 *   `null` will be `noStroke()` and `undefined` will have no effects.
 * @return A function that runs either `stroke()`, `noStroke()` or nothing.
 */
const parseStroke = colorValue => {
  if (colorValue === null) return noStroke.bind(window);
  if (colorValue === undefined) return returnVoid;
  if (typeof colorValue === "string")
    return stroke.bind(window, color(colorValue));

  return stroke.bind(window, colorValue);
};

/**
 * Creates a function that applies a fill color.
 * @param colorValue - Either a `p5.Color` instance, a color code string
 *   (e.g. `"#FFFFFF"`), `null` or `undefined`.
 *   `null` will be `noFill()` and `undefined` will have no effects.
 * @return A function that runs either `fill()`, `noFill()` or nothing.
 */
const parseFill = colorValue => {
  if (colorValue === null) return noFill.bind(window);
  if (colorValue === undefined) return returnVoid;
  if (typeof colorValue === "string")
    return fill.bind(window, color(colorValue));

  return fill.bind(window, colorValue);
};

/**
 * Creates a new `p5.Color` instance by replacing the alpha value with `alpha`.
 * The color mode should be `RGB` when using this function.
 * @param colorValue
 * @param alpha
 */
const colorWithAlpha = (colorValue, alpha) => {
  const colorObject =
    typeof colorValue === "string" ? color(colorValue) : colorValue;

  return color(red(colorObject), green(colorObject), blue(colorObject), alpha);
};

/**
 * Creates a new color by reversing each RGB value of the given `color`.
 * The alpha value will remain the same.
 * Be sure that the color mode is set to RGB ∈ [0, 255].
 * @param color
 * @return New `p5.Color` instance with reversed RGB values.
 */
const reverseColor = color =>
  color(255 - red(color), 255 - green(color), 255 - blue(color), alpha(color));

// ---- example ---------------------------------------------------------------

// -- functions ----

// -- main ----

function setup() {
  createCanvas(640, 480);
  noFill();
  strokeWeight(3);
}

function draw() {}
