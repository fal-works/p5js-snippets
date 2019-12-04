// Declared in "random.js":
/* global createRandomFunctions */

"use strict";

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

// -- modes ----

const defaultRandomMode = {
  sizeFactor: Random.ratio,
  angles: () => ({
    start: Random.angle(),
    end: Random.angle()
  }),
  repetition: 16
};

const randomModes = new Map();
randomModes.set("default", defaultRandomMode);
randomModes.set("discrete", {
  sizeFactor: () => Random.Discrete.ratio(0.1),
  angles: () => ({
    start: Random.Discrete.angle(QUARTER_PI),
    end: Random.Discrete.angle(QUARTER_PI)
  }),
  repetition: 16
});
randomModes.set("fan", {
  sizeFactor: Random.ratio,
  angles: () => {
    const directionAngle = Random.Discrete.angle(HALF_PI);
    const centralAngle = Random.value(HALF_PI);
    return getAngleRange(directionAngle, centralAngle);
  },
  repetition: 32
});
randomModes.set("curved", {
  sizeFactor: () => Random.Curved.ratio(pow2),
  angles: () => {
    const directionAngle = Random.angle();
    const centralAngle = Random.Curved.angle(pow4);
    return getAngleRange(directionAngle, centralAngle);
  },
  repetition: 32
});

// -- drawing functions ----

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

  const mode = randomModes.get(radioButton.value()) || defaultRandomMode;

  for (let i = 0, len = mode.repetition; i < len; i += 1) drawRandomPie(mode);

  pop();
};

const drawAlphaBackground = () => {
  fill(0, 0, 1, 0.1);
  rect(0, 0, width, height);
};

// -- main ----

function setup() {
  createCanvas(640, 640);
  noStroke();
  colorMode(HSB, 360, 1, 1, 1);

  radioButton = createRadio();
  for (const key of randomModes.keys()) radioButton.option(key);
  radioButton.position(20, 20);
  radioButton.value("default");

  drawObject();
}

function draw() {
  const count = frameCount % 120;

  if (count === 0) drawObject();
  else if (count > 75) drawAlphaBackground();
}
