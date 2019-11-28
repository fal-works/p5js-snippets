// ---- definition ------------------------------------------------------------

/**
 * Calculates the scale factor for fitting `contentSize` to `containerSize`
 * keeping the original aspect ratio.
 * @param contentSize - The width and height of the content.
 * @param containerSize - The width and height of the container.
 * @returns The calculated scale factor.
 */
const calculateScaleFactor = (contentSize, containerSize) => {
  return Math.min(
    containerSize.width / contentSize.width,
    containerSize.height / contentSize.height
  );
};

/**
 * Creates a p5 canvas that fits to `htmlElement`.
 * @param logicalSize - The logical width and height.
 * @param htmlElement - The container element. Defaults to `document.body`.
 * @returns The created canvas element and other related stuff.
 */
const createScaledCanvas = (logicalSize, htmlElement = document.body) => {
  const scaleFactor = calculateScaleFactor(
    logicalSize,
    htmlElement.getBoundingClientRect()
  );

  const element = createCanvas(
    logicalSize.width * scaleFactor,
    logicalSize.height * scaleFactor
  );

  const drawScaled = drawInLogicalSize => {
    push();
    scale(scaleFactor);
    drawInLogicalSize();
    pop();
  };

  return {
    element,
    drawScaled,
    logicalSize
  };
};

// ---- example ---------------------------------------------------------------

let scaledCanvas;

const drawInLogicalSize = () => {
  const {
    logicalSize: { width, height }
  } = scaledCanvas;

  const circleSize = 300;

  circle(width / 2, height / 2, circleSize);
};

setup = () => {
  scaledCanvas = createScaledCanvas({ width: 640, height: 480 });
};

draw = () => {
  background(240);
  scaledCanvas.drawScaled(drawInLogicalSize);
};
