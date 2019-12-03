// ---- definition ------------------------------------------------------------

/**
 * similar to p5 `curveVertex()` but takes a vector as argument.
 * @param vector - Coordinates of the vertex. `vector.z` is optional (for WebGL mode).
 */
const curveVertexFromVector = vector =>
  curveVertex(vector.x, vector.y, vector.z);

/**
 * Draws a curve through `vertices`.
 * @param vertices
 */
const drawCurve = vertices => {
  const { length } = vertices;
  beginShape();

  curveVertexFromVector(vertices[0]);
  for (let i = 0; i < length; i += 1) curveVertexFromVector(vertices[i]);
  curveVertexFromVector(vertices[length - 1]);

  endShape();
};

/**
 * Draws a curve through `vertices`, smoothly connecting the first and last vertex.
 * @param vertices
 */
const drawCurveClosed = vertices => {
  const { length } = vertices;
  beginShape();

  for (let i = 0; i < length; i += 1) curveVertexFromVector(vertices[i]);
  for (let i = 0; i < 3; i += 1) curveVertexFromVector(vertices[i]);

  endShape();
};

// ---- usage ---------------------------------------------------------------

/*
The below draws a curve through the given 4 points.
You may also use drawCurveClose() instead of drawCurve().
*/

// drawCurve([
//   { x: 30, y: 30 },
//   { x: 70, y: 30 },
//   { x: 70, y: 70 },
//   { x: 30, y: 70 }
// ]);

// ---- example ---------------------------------------------------------------

// -- functions ----

const createRandomVertex = () => {
  return {
    x: random(0.1, 0.9) * width,
    y: random(0.1, 0.9) * height
  };
};
const createRandomVertices = length =>
  Array.from({ length }, createRandomVertex);

const markVertex = vertex => circle(vertex.x, vertex.y, 20);
const markVertices = vertices => vertices.forEach(markVertex);

const drawNewCurve = parameter => {
  background(248);
  const vertices = createRandomVertices(4);

  stroke(96);
  if (parameter.close) drawCurveClosed(vertices);
  else drawCurve(vertices);

  stroke(192, 0, 0);
  markVertices(vertices);
};

// -- main ----

function setup() {
  createCanvas(640, 480);
  noFill();
  strokeWeight(3);

  drawNewCurve({ closed: false });
}

function draw() {
  switch (frameCount % 120) {
    case 0:
      drawNewCurve({ close: false });
      break;
    case 60:
      drawNewCurve({ close: true });
      break;
  }
}
