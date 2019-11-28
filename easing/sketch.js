// ---- definition ------------------------------------------------------------

const Ease = (() => {
  const square = x => x * x;
  const cube = x => x * x * x;
  const pow4 = x => square(x * x);

  /**
   * Concatenates two easing functions without normalization.
   * @param easingFunctionA
   * @param easingFunctionB
   * @param thresholdRatio
   * @return New easing function.
   */
  const concatenate = (
    easingFunctionA,
    easingFunctionB,
    thresholdRatio = 0.5
  ) => {
    return ratio => {
      if (ratio < thresholdRatio)
        return easingFunctionA(ratio / thresholdRatio);
      else {
        const ratioB = 1 - thresholdRatio;
        return easingFunctionB((ratio - thresholdRatio) / ratioB);
      }
    };
  };

  /**
   * Integrates two easing functions.
   * Results of both functions will be normalized depending on `thresholdRatio`.
   * @param easingFunctionA
   * @param easingFunctionB
   * @param thresholdRatio
   * @return New easing function.
   */
  const integrate = (
    easingFunctionA,
    easingFunctionB,
    thresholdRatio = 0.5
  ) => {
    return ratio => {
      if (ratio < thresholdRatio)
        return thresholdRatio * easingFunctionA(ratio / thresholdRatio);
      else {
        const ratioB = 1 - thresholdRatio;
        return (
          thresholdRatio +
          ratioB * easingFunctionB((ratio - thresholdRatio) / ratioB)
        );
      }
    };
  };

  const linear = ratio => ratio;

  const In = {
    quad: square,
    cubic: cube,
    quart: pow4,
    expo: x => (x ? Math.pow(2, 10 * (x - 1)) : 0),
    createBack: (coefficient = 1.70158) => x =>
      x * x * ((coefficient + 1) * x - coefficient)
  };

  const Out = {
    quad: x => -square(x - 1) + 1,
    cubic: x => cube(x - 1) + 1,
    quart: x => -pow4(x - 1) + 1,
    expo: x => (x < 1 ? -Math.pow(2, -10 * x) + 1 : 1),
    createBack: (coefficient = 1.70158) => {
      return x => {
        const r = x - 1;
        const r2 = r * r;
        return (coefficient + 1) * (r * r2) + coefficient * r2 + 1;
      };
    }
  };

  const InOut = {
    quad: integrate(In.quad, Out.quad),
    cubic: integrate(In.cubic, Out.cubic),
    quart: integrate(In.quart, Out.quart),
    expo: integrate(In.expo, Out.expo),
    createBack: coefficient =>
      integrate(In.createBack(coefficient), Out.createBack(coefficient))
  };

  const OutIn = {
    quad: integrate(Out.quad, In.quad),
    cubic: integrate(Out.cubic, In.cubic),
    quart: integrate(Out.quart, In.quart),
    expo: integrate(Out.expo, In.expo),
    createBack: coefficient =>
      integrate(Out.createBack(coefficient), In.createBack(coefficient))
  };

  return {
    concatenate,
    integrate,
    linear,
    In,
    Out,
    InOut,
    OutIn
  };
})();

// ---- Example ---------------------------------------------------------------

// -- constants ----

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
  line(-axisMargin, 0, axisScale, 0);
  line(0, axisMargin, 0, -axisScale);
  beginShape();
  curveVertex(0, easing(0));
  for (let x = 0; x <= 1; x += 0.1)
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
  circle(physicalX, physicalY, 7 + 5 * y);

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

const createDrawGraphBlock = (parameters, row, column) => {
  const { name, easing } = parameters;
  const x = graphIntervalX * (column + 0.35);
  const y = graphIntervalY * (row + 0.8);

  return () => {
    push();
    translate(x, y);
    drawName(name);
    drawGraph(easing);
    const progressRatio =
      (frameCount % intervalFrameCount) / intervalFrameCount;
    drawEasedPoint(easing, progressRatio);
    pop();
  };
};

// -- main ----

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
