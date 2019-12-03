// ---- definition ------------------------------------------------------------

/**
 * Collection of easing functions.
 */
const Ease = (() => {
  // -- common math functions ----

  const square = x => x * x;
  const cube = x => x * x * x;
  const pow4 = x => square(x * x);
  const { pow } = Math;

  // -- functions for generating composite easing functions ----

  const concatenate = (easingA, easingB, thresholdRatio = 0.5) => {
    const inverseThresholdRatio = 1 / thresholdRatio;

    return ratio => {
      if (ratio < thresholdRatio) return easingA(inverseThresholdRatio * ratio);
      else {
        const ratioB = 1 - thresholdRatio;
        return easingB((ratio - thresholdRatio) / ratioB);
      }
    };
  };

  const integrate = (easingA, easingB, thresholdRatio = 0.5) => {
    const inverseThresholdRatio = 1 / thresholdRatio;

    return ratio => {
      if (ratio < thresholdRatio)
        return thresholdRatio * easingA(inverseThresholdRatio * ratio);
      else {
        const ratioB = 1 - thresholdRatio;
        return (
          thresholdRatio + ratioB * easingB((ratio - thresholdRatio) / ratioB)
        );
      }
    };
  };

  // -- particular easing functions ----

  const In = {
    /**
     * "easeInQuad" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    quad: square,

    /**
     * "easeInCubic" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    cubic: cube,

    /**
     * "easeInQuart" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    quart: pow4,

    /**
     * "easeInExpo" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    expo: x => (x ? pow(2, 10 * (x - 1)) : 0),

    /**
     * Creates a new "easeInBack" function with `coefficient`.
     * @param coefficient Defaults to 1.70158
     * @returns "easeInBack" function.
     */
    createBack: (coefficient = 1.70158) => x =>
      x * x * ((coefficient + 1) * x - coefficient)
  };

  const Out = {
    /**
     * "easeOutQuad" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    quad: x => -square(x - 1) + 1,

    /**
     * "easeOutCubic" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    cubic: x => cube(x - 1) + 1,

    /**
     * "easeOutQuart" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    quart: x => -pow4(x - 1) + 1,

    /**
     * "easeOutExpo" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    expo: x => (x < 1 ? -pow(2, -10 * x) + 1 : 1),

    /**
     * Creates a new "easeOutBack" function with `coefficient`.
     * @param coefficient Defaults to 1.70158
     * @returns "easeOutBack" function.
     */
    createBack: (coefficient = 1.70158) => {
      return x => {
        const r = x - 1;
        const r2 = r * r;
        return (coefficient + 1) * (r * r2) + coefficient * r2 + 1;
      };
    }
  };

  const InOut = {
    /**
     * "easeInOutQuad" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    quad: integrate(In.quad, Out.quad),

    /**
     * "easeInOutCubic" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    cubic: integrate(In.cubic, Out.cubic),

    /**
     * "easeInOutQuart" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    quart: integrate(In.quart, Out.quart),

    /**
     * "easeInOutExpo" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    expo: integrate(In.expo, Out.expo),

    /**
     * Creates a new "easeInOutBack" function with `coefficient`.
     * @param coefficient Defaults to 1.70158
     * @returns "easeInOutBack" function.
     */
    createBack: coefficient =>
      integrate(In.createBack(coefficient), Out.createBack(coefficient))
  };

  const OutIn = {
    /**
     * "easeOutInQuad" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    quad: integrate(Out.quad, In.quad),

    /**
     * "easeOutInCubic" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    cubic: integrate(Out.cubic, In.cubic),

    /**
     * "easeOutInQuart" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    quart: integrate(Out.quart, In.quart),

    /**
     * "easeOutInExpo" function.
     * @param x Any ratio.
     * @returns Eased ratio. `0` if x=0, `1` if x=1.
     */
    expo: integrate(Out.expo, In.expo),

    /**
     * Creates a new "easeOutInBack" function with `coefficient`.
     * @param coefficient Defaults to 1.70158
     * @returns "easeOutInBack" function.
     */
    createBack: coefficient =>
      integrate(Out.createBack(coefficient), In.createBack(coefficient))
  };

  return {
    /**
     * Linear easing function.
     * @param ratio
     * @returns Same value as `ratio`.
     */
    linear: ratio => ratio,

    /** Collection of "easeIn" functions. */
    In,

    /** Collection of "easeOut" functions. */
    Out,

    /** Collection of "easeInOut" functions. */
    InOut,

    /** Collection of "easeOutIn" functions. */
    OutIn,

    /**
     * Concatenates two easing functions without normalization.
     * @param easingA - Any easing function.
     * @param easingB - Any easing function.
     * @param thresholdRatio - Defaults to `0.5`.
     * @returns New easing function.
     */
    concatenate,

    /**
     * Integrates two easing functions.
     * Results of both functions will be normalized depending on `thresholdRatio`.
     * @param easingA - Any easing function.
     * @param easingB - Any easing function.
     * @param thresholdRatio - Defaults to `0.5`.
     * @returns New easing function.
     */
    integrate
  };
})();

// ---- Example ---------------------------------------------------------------

// -- constants ----

const curveDrawingResolution = 10;
const graphIntervalX = 120;
const graphIntervalY = 150;
const axisScale = 80;
const axisMargin = 10;
const markerSize = 5;
const intervalFrameCount = 60;

// -- functions ----

const drawGraph = easing => {
  stroke(32);
  noFill();

  // axis
  line(-axisMargin, 0, axisScale, 0);
  line(0, axisMargin, 0, -axisScale);

  // curve
  beginShape();
  curveVertex(0, easing(0));
  for (let x = 0, deltaX = 1 / curveDrawingResolution; x <= 1; x += deltaX)
    curveVertex(axisScale * x, -axisScale * easing(x));
  curveVertex(axisScale, -axisScale * easing(1));
  endShape();
};

const drawEasedPoint = (easing, x) => {
  noStroke();
  fill(0, 96, 255);
  const y = easing(x);
  const physicalX = axisScale * x;
  const physicalY = -axisScale * y;

  // point on the curve
  circle(physicalX, physicalY, 7 + 5 * y);

  // marker on the X-axis
  stroke(0, 96, 255);
  strokeWeight(4);
  line(-markerSize, physicalY, markerSize, physicalY);
  strokeWeight(1);
};

const drawName = name => {
  noStroke();
  fill(32);
  text(name, -5, 25);
};

const drawGraphBlock = (name, easing) => {
  drawName(name);
  drawGraph(easing);
  const progressRatio = (frameCount % intervalFrameCount) / intervalFrameCount;
  drawEasedPoint(easing, progressRatio);
};

const createDrawGraphBlock = (parameters, row, column) => {
  const { name, easing } = parameters;
  const x = graphIntervalX * (column + 0.35);
  const y = graphIntervalY * (row + 0.8);

  return () => {
    push();
    translate(x, y);
    drawGraphBlock(name, easing);
    pop();
  };
};

// -- main ----

/**
 * 2-dimensional array of parameters for `createDrawGraphBlock()`.
 *
 * For example `gridData[0][1]` is for the graph block at row index 0, column index 1.
 */
const gridData = [
  [
    { name: "in / quad", easing: Ease.In.quad },
    { name: "in / cubic", easing: Ease.In.cubic },
    { name: "in / quart", easing: Ease.In.quart },
    { name: "in / expo", easing: Ease.In.expo },
    { name: "in / back", easing: Ease.In.createBack() }
  ],
  [
    { name: "out / quad", easing: Ease.Out.quad },
    { name: "out / cubic", easing: Ease.Out.cubic },
    { name: "out / quart", easing: Ease.Out.quart },
    { name: "out / expo", easing: Ease.Out.expo },
    { name: "out / back", easing: Ease.Out.createBack() }
  ],
  [
    { name: "in-out / quad", easing: Ease.InOut.quad },
    { name: "in-out / cubic", easing: Ease.InOut.cubic },
    { name: "in-out / quart", easing: Ease.InOut.quart },
    { name: "in-out / expo", easing: Ease.InOut.expo },
    { name: "in-out / back", easing: Ease.InOut.createBack() }
  ],
  [
    { name: "out-in / quad", easing: Ease.OutIn.quad },
    { name: "out-in / cubic", easing: Ease.OutIn.cubic },
    { name: "out-in / quart", easing: Ease.OutIn.quart },
    { name: "out-in / expo", easing: Ease.OutIn.expo },
    { name: "out-in / back", easing: Ease.OutIn.createBack() }
  ]
];

/**
 * Converts `gridData` to a flat array of functions that draw graph blocks.
 */
const graphBlocks = gridData
  .map((rowData, rowIndex) =>
    rowData.map((parameters, columnIndex) =>
      createDrawGraphBlock(parameters, rowIndex, columnIndex)
    )
  )
  .reduce((flatArray, subArray) => flatArray.concat(subArray), []);

function setup() {
  createCanvas(640, 640);
}

function draw() {
  background(248);
  graphBlocks.forEach(drawBlock => drawBlock());
}
