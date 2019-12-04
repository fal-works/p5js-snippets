"use strict";

window.keyTyped = (() => {
  const currentKeyTyped = window.keyTyped;
  const saveCanvasPNG = () => {
    if (key === "g") save("image.png");
  };

  return currentKeyTyped
    ? () => {
        currentKeyTyped();
        saveCanvasPNG();
      }
    : saveCanvasPNG;
})();
