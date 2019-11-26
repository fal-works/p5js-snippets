// ---- definition ------------------------------------------------------------

const Random = (() => {
  const { random, floor } = Math;

  /**
   * Returns random value from `0` to (but not including) `2 * PI`.
   * @return A random radians value.
   */
  const angle = () => random() * TWO_PI;

  /**
   * Returns random integer from 0 up to (but not including) `maxInt`.
   * `maxInt` is not expected to be negative.
   * @param maxInt
   * @return A random integer value.
   */
  const integer = maxInt => floor(random() * maxInt);

  /**
   * Returns random integer from `minInt` up to (but not including) `maxInt`.
   * The case where `minInt > maxInt` or `maxInt <= 0` is not expected.
   * @param minInt
   * @param maxInt
   * @return A random integer value.
   */
  const integerBetween = (minInt, maxInt) =>
    minInt + floor(random() * (maxInt - minInt));

  /**
   * Returns `n` or `-n` randomly.
   * @param n Any number.
   * @return A random-signed value of `n`.
   */
  const signed = n => (random() < 0.5 ? n : -n);

  /**
   * Removes and returns one element from `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @return A random element.
   */
  const removeFromArray = array => array.splice(integer(array.length), 1)[0];

  /**
   * Returns `true` or `false` randomly.
   * @param probability A number between 0 and 1.
   * @return `true` with the given `probability`.
   */
  const bool = probability => random() < probability;

  /**
   * Returns random value from `-absoluteValue` up to (but not including) `absoluteValue`.
   * @param absoluteValue
   * @return A random value.
   */
  const fromAbsolute = absoluteValue =>
    -absoluteValue + random() * 2 * absoluteValue;

  /**
   * Similar to `Math.random()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @return A random value.
   */
  const ratioCurved = curve => curve(random());

  /**
   * Similar to p5 `random()` with 1 number argument, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @param magnitude
   * @return A random value.
   */
  const valueCurved = (curve, magnitude) => curve(random()) * magnitude;

  /**
   * Similar to p5 `random()` with 2 number arguments, but remaps the result by `curve`.
   * `start` should not be greater than `end`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @param start
   * @param end
   * @return A random value.
   */
  const betweenCurved = (curve, start, end) =>
    start + curve(random()) * (end - start);

  return Object.freeze({
    angle,
    integer,
    integerBetween,
    signed,
    removeFromArray,
    bool,
    fromAbsolute,
    ratioCurved,
    valueCurved,
    betweenCurved
  });
})();

// ---- Example ---------------------------------------------------------------

// -- Constants ----

const numberLineLength = 0.6 * 640;
const numberLineScale = numberLineLength / 4;

// -- Function for drawing number line ----

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

// -- Data point ----

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

// -- Data block ----

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
      name: "random(1)",
      randomFunction: () => random(1)
    },
    {
      name: "random(-1, 1)",
      randomFunction: () => random(-1, 1)
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
