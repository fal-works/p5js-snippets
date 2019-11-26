// ---- definition ------------------------------------------------------------

/**
 * For internal use.
 * 5 6 7
 * 4 u 0
 * 3 2 1
 */
let moveDirectionVectorGrid;

let moveDirectionVector;
let horizontalMove = 0;
let verticalMove = 0;
let up = false;
let left = false;
let down = false;
let right = false;

const initializeMoveKeyStatus = () => {
  moveDirectionVectorGrid = [[5, 4, 3], [6, undefined, 2], [7, 0, 1]].map(
    column =>
      column.map(directionIndex => {
        if (directionIndex !== undefined)
          return p5.Vector.fromAngle(directionIndex * (Math.PI / 4));
        else return createVector();
      })
  );

  moveDirectionVector = moveDirectionVectorGrid[1][1];
};

const updateMoveKeyStatus = () => {
  horizontalMove = (left ? -1 : 0) + (right ? 1 : 0);
  verticalMove = (up ? -1 : 0) + (down ? 1 : 0);
  moveDirectionVector =
    moveDirectionVectorGrid[horizontalMove + 1][verticalMove + 1];
};

const detectMoveKeysPressed = () => {
  switch (key) {
    case "w":
      up = true;
      break;
    case "a":
      left = true;
      break;
    case "s":
      down = true;
      break;
    case "d":
      right = true;
      break;
  }

  switch (keyCode) {
    case 38:
      up = true;
      break;
    case 37:
      left = true;
      break;
    case 40:
      down = true;
      break;
    case 39:
      right = true;
      break;
  }

  updateMoveKeyStatus();
};

const detectMoveKeysReleased = () => {
  switch (key) {
    case "w":
      up = false;
      break;
    case "a":
      left = false;
      break;
    case "s":
      down = false;
      break;
    case "d":
      right = false;
      break;
  }

  switch (keyCode) {
    case 38:
      up = false;
      break;
    case 37:
      left = false;
      break;
    case 40:
      down = false;
      break;
    case 39:
      right = false;
      break;
  }

  updateMoveKeyStatus();
};

// ---- example ---------------------------------------------------------------

// -- variables & functions ----

let myPosition;
const speed = 5;

const moveMe = velocity => myPosition.add(velocity);

const drawMe = () =>
  circle(myPosition.x, myPosition.y, 100 + 20 * Math.sin(frameCount * 0.1));

// -- main ----

function setup() {
  createCanvas(640, 480);

  initializeMoveKeyStatus();
  myPosition = createVector(width / 2, height / 2);

  noStroke();
  fill(64);
}

function draw() {
  background(248);

  const velocity = moveDirectionVector.copy().mult(speed);
  moveMe(velocity);

  drawMe();
}

function keyPressed() {
  detectMoveKeysPressed();
}

function keyReleased() {
  detectMoveKeysReleased();
}
