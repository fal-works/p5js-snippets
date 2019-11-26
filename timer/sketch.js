// ---- definition ------------------------------------------------------------

/**
 * Creates a function that runs `onProgress` but has no effect after running the specified number of times.
 * @param parameters.duration - The duration for which the returning function remains alive.
 * @param parameters.onProgress - A function that takes progress ratio (which changes from 0 to 1) as argument.
 */
const createTimer = parameters => {
  const { duration, onProgress } = parameters;

  let progressCount = 0;
  let isCompleted = false;

  return () => {
    if (isCompleted) return false;

    const progressRatio = progressCount / duration;
    onProgress(progressRatio);

    if (progressRatio >= 1) return false;
    progressCount += 1;
    return true;
  };
};

// ---- usage ----------------------------------------------------------------

const sampleTimer = createTimer({
  duration: 4,
  onProgress: progressRatio => console.log(`Progress ratio: ${progressRatio}`)
});
while (sampleTimer()) {
  // loops until false returns
}

/* [result]
Progress ratio: 0
Progress ratio: 0.25
Progress ratio: 0.5
Progress ratio: 0.75
Progress ratio: 1
*/

// ---- example ---------------------------------------------------------------

let timers = [];

const createRandomTimer = () => {
  const x = random(width);
  const y = random(height);

  const onProgress = progressRatio => {
    const alpha = (1 - progressRatio) * 255; // From 255 to 0
    stroke(64, 96, 192, alpha);

    const size = 200 * progressRatio; // From 0 to 200
    circle(x, y, size);
  };

  return createTimer({
    duration: 120,
    onProgress
  });
};

function setup() {
  createCanvas(640, 480);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(252, 252, 255);

  if (frameCount % 15 === 0) timers.push(createRandomTimer());

  timers = timers.filter(timer => timer()); // timer is removed if it is completed (i.e. returns false).
}
