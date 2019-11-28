// ---- definition ------------------------------------------------------------

/**
 * Creates a collection of functions that return random values.
 * @param random - A function that returns a random value from `0` to (but not including) `1`. Defaults fo `Math.random`.
 * @returns Functions that return random values.
 */
const createRandomFunctions = (random = Math.random) => {
  const { floor } = Math;

  return {
    /**
     * Returns a random value from `0` to (but not including) `1`.
     * @returns A random ratio.
     */
    ratio: random,

    /**
     * Returns a random value from `0` to (but not including) `value`.
     * @param max
     * @returns A random value.
     */
    value: max => random() * max,

    /**
     * Returns a random value from `min` up to (but not including) `max`.
     * The case where `min > max` is not expected.
     * @param min
     * @param max
     * @returns A random integer value.
     */
    between: (min, max) => min + random() * (max - min),

    /**
     * Returns a random value from `0` to (but not including) `2 * PI`.
     * @returns A random radians value.
     */
    angle: () => random() * TWO_PI,

    /**
     * Returns a random integer from 0 up to (but not including) `maxInt`.
     * `maxInt` is not expected to be negative.
     * @param maxInt
     * @returns A random integer value.
     */
    integer: maxInt => floor(random() * maxInt),

    /**
     * Returns a random integer from `minInt` up to (but not including) `maxInt`.
     * The case where `minInt > maxInt` is not expected.
     * @param minInt
     * @param maxInt
     * @returns A random integer value.
     */
    integerBetween: (minInt, maxInt) =>
      minInt + floor(random() * (maxInt - minInt)),

    /**
     * Returns `n` or `-n` randomly.
     * @param n Any number.
     * @returns A random-signed value of `n`.
     */
    signed: n => (random() < 0.5 ? n : -n),

    /**
     * Removes and returns one element from `array` randomly.
     * `array` is not expected to be empty.
     * @param array
     * @returns A random element.
     */
    removeFromArray: array =>
      array.splice(floor(random() * array.length), 1)[0],

    /**
     * Returns `true` or `false` randomly.
     * @param probability A number between 0 and 1.
     * @returns `true` with the given `probability`.
     */
    bool: probability => random() < probability,

    /**
     * Returns a random value from `-absoluteValue` up to (but not including) `absoluteValue`.
     * @param absoluteValue
     * @returns A random value.
     */
    fromAbsolute: absoluteValue =>
      -absoluteValue + random() * 2 * absoluteValue,

    /**
     * Similar to `ratio()`, but remaps the result by `curve`.
     * @param curve Any function that takes a random value between [0, 1] and returns a remapped value.
     * @returns A random value.
     */
    ratioCurved: curve => curve(random()),

    /**
     * Similar to p5 `value()`, but remaps the result by `curve`.
     * @param curve Any function that takes a random value between [0, 1] and returns a remapped value.
     * @param magnitude
     * @returns A random value.
     */
    valueCurved: (curve, magnitude) => curve(random()) * magnitude,

    /**
     * Similar to `between()`, but remaps the result by `curve`.
     * `start` should not be greater than `end`.
     * @param curve Any function that takes a random value between [0, 1] and returns a remapped value.
     * @param start
     * @param end
     * @returns A random value.
     */
    betweenCurved: (curve, start, end) =>
      start + curve(random()) * (end - start)
  };
};

// ---- example ---------------------------------------------------------------

// -- common ----

const Random = createRandomFunctions();

const numberLineLength = 0.6 * 640;
const numberLineScale = numberLineLength / 4;

// -- function for drawing number line ----

const numberLineHalfLength = numberLineLength / 2;
const numberLineValues = [-2, -1, 0, 1, 2];
const drawNumberLine = () => {
  textAlign(CENTER);
  stroke(32);
  fill(32);
  line(-numberLineHalfLength, 0, numberLineHalfLength, 0);
  numberLineValues.forEach(value => {
    const x = value * numberLineScale;
    stroke(32);
    line(x, -5, x, 5);
    noStroke();
    text(value, x, 20);
  });
};

// -- data point ----

const createDataPoint = value => {
  return {
    value,
    life: 1
  };
};
const drawDataPoint = dataPoint => {
  const { life } = dataPoint;

  const alpha = life * 255;
  fill(192, 0, 64, alpha);

  const x = numberLineScale * dataPoint.value;
  const size = life * 15;
  circle(x, 0, size);

  dataPoint.life -= 0.02;
  return dataPoint.life > 0; // true if alive
};

// -- data block ----

const createDataBlock = (parameters, index) => {
  const x = 0.03 * width;
  const y = 30 + index * 50;
  const xOffset = 0.63 * width;

  return {
    name: parameters.name,
    randomFunction: parameters.randomFunction,
    x,
    y,
    xOffset,
    dataPoints: []
  };
};
const drawName = name => {
  textAlign(LEFT);
  noStroke();
  fill(32);
  text(name, 0, 5);
};
const drawDataPointsOf = block => {
  noStroke();
  block.dataPoints = block.dataPoints.filter(drawDataPoint);
};
const drawDataBlock = block => {
  push();

  translate(block.x, block.y);
  drawName(block.name);

  translate(block.xOffset, 0);
  drawNumberLine();
  drawDataPointsOf(block);

  pop();
};
const addData = block => {
  const value = block.randomFunction();
  block.dataPoints.push(createDataPoint(value));
};

// -- main ----

const dataBlocks = [];

const prepareDataBlocks = () => {
  const parameterList = [
    {
      name: "Random.ratio()",
      randomFunction: () => Random.ratio(1)
    },
    {
      name: "Random.between(-1, 1)",
      randomFunction: () => Random.between(-1, 1)
    },
    {
      name: "Random.integer(3)",
      randomFunction: () => Random.integer(3)
    },
    {
      name: "Random.integerBetween(-1, 2)",
      randomFunction: () => Random.integerBetween(-1, 2)
    },
    {
      name: "Random.signed(1)",
      randomFunction: () => Random.signed(1)
    },
    {
      name: "Random.fromAbsolute(2)",
      randomFunction: () => Random.fromAbsolute(2)
    },
    {
      name: "Random.ratioCurved(sq)",
      randomFunction: () => Random.ratioCurved(sq)
    },
    {
      name: "Random.valueCurved(sq, 2)",
      randomFunction: () => Random.valueCurved(sq, 2)
    },
    {
      name: "Random.betweenCurved(sq,-1,1)",
      randomFunction: () => Random.betweenCurved(sq, -1, 1)
    }
  ];

  dataBlocks.length = 0;
  dataBlocks.push(...parameterList.map(createDataBlock));
};

function setup() {
  createCanvas(640, 480);
  background(252);
  textAlign(CENTER);

  prepareDataBlocks();
}

function draw() {
  background(248);

  if (frameCount % 5 === 0) dataBlocks.forEach(addData);
  dataBlocks.forEach(drawDataBlock);
}
