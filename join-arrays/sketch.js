// ---- definition ------------------------------------------------------------

/**
 * Joins two arrays and runs `callback` once for each joined pair.
 * You should not remove elements from arrays during the iteration.
 * @param arrayA - Any filled array.
 * @param arrayB - Any filled array.
 * @param callback - Any function that takes an element of `arrayA` and an element of `arrayB` as arguments.
 */
const nestedLoopJoin = (arrayA, arrayB, callback) => {
  for (let i = 0; i < arrayA.length; i += 1) {
    for (let k = 0; k < arrayB.length; k += 1) callback(arrayA[i], arrayB[k]);
  }
};

/**
 * Runs `callback` once for each pair within `array`.
 * @param array - Any filled array.
 * @param callback - Any function that takes two different elements of `arrayA` as arguments.
 */
const roundRobin = (array, callback) => {
  const lastIndex = array.length - 1;
  for (let i = 0; i < lastIndex; i += 1) {
    for (let k = i + 1; k < array.length; k += 1) callback(array[i], array[k]);
  }
};

// ---- Usage -----------------------------------------------------------------

const arrayA = ["A0", "A1", "A2", "A3"];
const arrayB = ["B0", "B1"];
const printPair = (former, latter) => console.log(`${former} - ${latter}`);

console.log("nested loop join:");
nestedLoopJoin(arrayA, arrayB, printPair);

console.log("round-robin:");
roundRobin(arrayA, printPair);

/* [result]
nested loop join:
A0 - B0
A0 - B1
A1 - B0
A1 - B1
A2 - B0
A2 - B1
A3 - B0
A3 - B1
round-robin:
A0 - A1
A0 - A2
A0 - A3
A1 - A2
A1 - A3
A2 - A3
*/

// ---- Example ---------------------------------------------------------------

// -- Functions for preparing point data ----

const createPosition = (minY, maxY) => {
  return {
    x: (0.1 + random(0.8)) * width,
    y: minY + random(maxY - minY)
  };
};
const createPoints = parameters => {
  const { groupColor, minY, maxY } = parameters;
  const positionArray = Array.from({ length: 10 }, () =>
    createPosition(minY, maxY)
  );

  return { positionArray, groupColor };
};

// -- Functions for drawing points ----

const drawPoint = position => circle(position.x, position.y, 20);
const drawPoints = points => {
  stroke(252);
  fill(points.groupColor);
  points.positionArray.forEach(drawPoint);
};

// -- Functions for drawing links between points ----

const drawLink = (positionA, positionB) =>
  line(positionA.x, positionA.y, positionB.x, positionB.y);

const drawInternalLinks = points => {
  stroke(points.groupColor);
  roundRobin(points.positionArray, drawLink);
};

const drawExternalLinks = (pointsA, pointsB) => {
  stroke(0, 0.2);
  nestedLoopJoin(pointsA.positionArray, pointsB.positionArray, drawLink);
};

// -- main ----

const prepareData = () => {
  colorMode(HSB, 360, 1, 1, 1);
  const cyan = color(210, 1, 1);
  const magenta = color(330, 0.7, 0.98);

  const cyanPoints = createPoints({
    groupColor: cyan,
    minY: 0.1 * height,
    maxY: 0.4 * height
  });
  const magentaPoints = createPoints({
    groupColor: magenta,
    minY: 0.6 * height,
    maxY: 0.9 * height
  });

  return { cyanPoints, magentaPoints };
};

const drawNewNetwork = () => {
  background(252);

  const { cyanPoints, magentaPoints } = prepareData();

  drawInternalLinks(cyanPoints);
  drawInternalLinks(magentaPoints);

  drawExternalLinks(cyanPoints, magentaPoints);

  drawPoints(cyanPoints);
  drawPoints(magentaPoints);
};

function setup() {
  createCanvas(640, 480);

  drawNewNetwork();
}

function draw() {
  if (frameCount % 60) return;
  drawNewNetwork();
}
