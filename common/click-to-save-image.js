"use strict";

const saveCanvasPNG = () => save("image.png");
const currentMouseClicked = window.mouseClicked;
window.mouseClicked = currentMouseClicked
  ? () => {
      currentMouseClicked();
      saveCanvasPNG();
    }
  : saveCanvasPNG;
