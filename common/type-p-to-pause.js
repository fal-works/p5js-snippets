"use strict";

window.keyTyped = (() => {
  const currentKeyTyped = window.keyTyped;

  let paused = false;
  const pauseOrResume = () => {
    if (key !== "p") return;

    paused = !paused;

    if (paused) noLoop();
    else loop();
  };

  return currentKeyTyped
    ? () => {
        currentKeyTyped();
        pauseOrResume();
      }
    : pauseOrResume;
})();
