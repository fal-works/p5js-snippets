"use strict";

const saveCanvasPNG = () => {
  if (key === "g") save("image.png");
};
const currentKeyTyped = window.keyTyped;
window.keyTyped = currentKeyTyped
  ? () => {
      currentKeyTyped();
      saveCanvasPNG();
    }
  : saveCanvasPNG;
