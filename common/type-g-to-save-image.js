"use strict";

const saveCanvasPNG = () => save("image.png");
const currentKeyTyped = window.keyTyped;
window.keyTyped = currentKeyTyped
  ? () => {
      currentKeyTyped();
      saveCanvasPNG();
    }
  : saveCanvasPNG;
