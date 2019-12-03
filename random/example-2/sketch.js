// Declared in "random.js":
/* global createRandomFunctions */

"use strict";

// ---- example ---------------------------------------------------------------

// -- common ----

const Random = createRandomFunctions();
const pow2 = x => x * x;
const pow4 = x => pow2(pow2(x));

let radioButton;

const getAngleRange = (directionAngle, centralAngle) => {
  const halfCentralAngle = centralAngle / 2;

  return {
    start: directionAngle - halfCentralAngle,
    end: directionAngle + halfCentralAngle
  };
};

//TODO: use Map
const randomModes = {
  default: {
    sizeFactor: Random.ratio,
    angles: () => ({
      start: Random.angle(),
      end: Random.angle()
    }),
    repetition: 16
  },
  discrete: {
    sizeFactor: () => Random.discreteRatio(0.1),
    angles: () => ({
      start: Random.discreteValue(QUARTER_PI, TWO_PI),
      end: Random.discreteValue(QUARTER_PI, TWO_PI)
    }),
    repetition: 16
  },
  fan: {
    sizeFactor: Random.ratio,
    angles: () => {
      const directionAngle = Random.discreteValue(HALF_PI, TWO_PI);
      const centralAngle = Random.value(HALF_PI);
      return getAngleRange(directionAngle, centralAngle);
    },
    repetition: 32
  },
  curved: {
    sizeFactor: () => Random.ratioCurved(pow2),
    angles: () => {
      const directionAngle = Random.angle();
      const centralAngle = Random.valueCurved(pow4, TWO_PI);
      return getAngleRange(directionAngle, centralAngle);
    },
    repetition: 32
  }
};

const drawRandomPie = randomMode => {
  const diameter = 100 + randomMode.sizeFactor() * 460;
  const { start, end } = randomMode.angles();
  arc(0, 0, diameter, diameter, start, end, PIE);
};

const drawObject = () => {
  background(0, 0, 0.98);
  push();

  blendMode(BURN);
  fill(random(360), 0.3, 0.65);
  translate(width / 2, height / 2);

  let mode;

  switch (radioButton.value()) {
    default:
      mode = randomModes.default;
      break;
    case "discrete":
      mode = randomModes.discrete;
      break;
    case "fan":
      mode = randomModes.fan;
      break;
    case "curved":
      mode = randomModes.curved;
      break;
  }

  for (let i = 0, len = mode.repetition; i < len; i += 1) drawRandomPie(mode);

  pop();
};

const drawAlphaBackground = () => {
  fill(0, 0, 1, 0.1);
  rect(0, 0, width, height);
};

function setup() {
  createCanvas(640, 640);
  noStroke();
  colorMode(HSB, 360, 1, 1, 1);

  radioButton = createRadio();
  radioButton.option("default");
  radioButton.option("discrete");
  radioButton.option("fan");
  radioButton.option("curved");
  radioButton.position(20, 20);
  radioButton.value("default");

  drawObject();
}

function draw() {
  const count = frameCount % 120;

  if (count === 0) {
    drawObject();
    return;
  }

  if (count > 75) {
    drawAlphaBackground();
  }
}
