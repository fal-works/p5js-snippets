// Declared in "random.js":
/* global createRandomFunctions */

"use strict";

// -- common ----

const Random = createRandomFunctions();

const numberLineLength = 0.6 * 640;
const numberLineScale = numberLineLength / 4;
const dataPointLivingDuration = 90;
const dataPointLifeChangeRate = 1 / dataPointLivingDuration;

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

  const alpha = life * 176;
  fill(192, 0, 64, alpha);

  const x = numberLineScale * dataPoint.value;
  const size = life * 18;
  circle(x, 0, size);

  dataPoint.life -= dataPointLifeChangeRate;
  return dataPoint.life > 0; // true if alive
};

// -- data block ----

const createDataBlock = (parameters, index) => {
  const x = 0.05 * width;
  const y = 30 + index * 50;
  const xOffset = 0.6 * width;

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
  blendMode(MULTIPLY);
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
  const pow5 = x => Math.pow(x, 5);

  const parameterList = [
    {
      name: "ratio()",
      randomFunction: () => Random.ratio(1)
    },
    {
      name: "between(-1, 1)",
      randomFunction: () => Random.between(-1, 1)
    },
    {
      name: "Integer.value(3)",
      randomFunction: () => Random.Integer.value(3)
    },
    {
      name: "Integer.between(-1, 2)",
      randomFunction: () => Random.Integer.between(-1, 2)
    },
    {
      name: "sign(0.5) * 0.8",
      randomFunction: () => Random.sign(0.5) * 0.8
    },
    {
      name: "fromAbsolute(2)",
      randomFunction: () => Random.fromAbsolute(2)
    },
    {
      name: "Curved.ratio(pow5)",
      randomFunction: () => Random.Curved.ratio(pow5)
    },
    {
      name: "Curved.value(pow5, 2)",
      randomFunction: () => Random.Curved.value(pow5, 2)
    },
    {
      name: "Curved.between(pow5, -2, 2)",
      randomFunction: () => Random.Curved.between(pow5, -2, 2)
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
