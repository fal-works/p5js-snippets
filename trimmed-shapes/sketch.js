// ---- definition ------------------------------------------------------------

/**
 * A collection of functions & function generators for drawing
 * trimmed 2D shapes.
 */
const TrimmedShape = (() => {
  // -- general function ----

  /**
   * Maps `value` from the range [`start`, `end`] to the range [0, 1].
   * @param value
   * @param start
   * @param end
   * @return Mapped value between 0 and 1 (unclamped).
   */
  const inverseLerp = (value, start, end) => (value - start) / (end - start);

  // -- line ----

  const line = (x1, y1, x2, y2, startRatio, endRatio) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    line(
      x1 + startRatio * dx,
      y1 + startRatio * dy,
      x1 + endRatio * dx,
      y1 + endRatio * dy
    );
  };

  const createLine = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return (startRatio, endRatio) =>
      line(
        x1 + startRatio * dx,
        y1 + startRatio * dy,
        x1 + endRatio * dx,
        y1 + endRatio * dy
      );
  };

  // -- ellipse & circle ----

  const ellipse = (x, y, sizeX, sizeY, startRatio, endRatio, mode, detail) => {
    if (startRatio === endRatio) return;
    arc(
      x,
      y,
      sizeX,
      sizeY,
      startRatio * TWO_PI,
      endRatio * TWO_PI,
      mode,
      detail
    );
  };

  const createEllipse = (x, y, sizeX, sizeY, mode, detail) => (
    startRatio,
    endRatio
  ) => ellipse(x, y, sizeX, sizeY, startRatio, endRatio, mode, detail);

  const circle = (x, y, size, startRatio, endRatio, mode, detail) =>
    ellipse(x, y, size, size, startRatio, endRatio, mode, detail);

  const createCircle = (x, y, size, mode, detail) =>
    createEllipse(x, y, size, size, mode, detail);

  // -- polygon ----

  /** For internal use in `createPaths()`. */
  const createPathParameters = (from, to) => {
    return {
      from,
      to,
      length: dist(from.x, from.y, to.x, to.y)
    };
  };

  /**
   * For internal use in `createPolygon()`.
   * @param vertices - Array of objects with `x` and `y` coordinates.
   */
  const createPaths = vertices => {
    const vertexCount = vertices.length;
    const pathParameters = new Array(vertexCount);
    const lastIndex = vertexCount - 1;

    let totalLength = 0;

    for (let i = 0; i < lastIndex; i += 1) {
      const parameter = createPathParameters(vertices[i], vertices[i + 1]);
      pathParameters[i] = parameter;
      totalLength += parameter.length;
    }

    const lastParameter = createPathParameters(
      vertices[lastIndex],
      vertices[0]
    );
    pathParameters[lastIndex] = lastParameter;
    totalLength += lastParameter.length;

    const paths = new Array(vertexCount);

    for (let i = 0, lastThresholdRatio = 0; i < vertexCount; i += 1) {
      const parameters = pathParameters[i];
      const lengthRatio = parameters.length / totalLength;
      const nextThresholdRatio = lastThresholdRatio + lengthRatio;
      paths[i] = {
        from: parameters.from,
        to: parameters.to,
        previousRatio: lastThresholdRatio,
        nextRatio: nextThresholdRatio
      };
      lastThresholdRatio = nextThresholdRatio;
    }

    return paths;
  };

  /** For internal use in `createPolygon()`. */
  const getStartPathIndex = (startRatio, paths) => {
    for (let i = paths.length - 1; i >= 0; i -= 1) {
      if (paths[i].previousRatio <= startRatio) return i;
    }
    return 0;
  };
  /** For internal use in `createPolygon()`. */
  const getEndPathIndex = (endRatio, paths) => {
    const { length } = paths;
    for (let i = 0; i < length; i += 1) {
      if (endRatio <= paths[i].nextRatio) return i;
    }
    return length - 1;
  };

  /** For internal use in `createPolygon()`. */
  const drawVertexOnPath = (path, lerpRatio) => {
    const { from, to } = path;
    vertex(lerp(from.x, to.x, lerpRatio), lerp(from.y, to.y, lerpRatio));
  };

  const createPolygon = vertices => {
    const paths = createPaths(vertices);

    return (startRatio, endRatio) => {
      const startPathIndex = getStartPathIndex(startRatio, paths);
      const endPathIndex = getEndPathIndex(endRatio, paths);
      const startPathRatio = inverseLerp(
        startRatio,
        paths[startPathIndex].previousRatio,
        paths[startPathIndex].nextRatio
      );
      const endPathRatio = inverseLerp(
        endRatio,
        paths[endPathIndex].previousRatio,
        paths[endPathIndex].nextRatio
      );

      beginShape();
      drawVertexOnPath(paths[startPathIndex], startPathRatio);
      if (startPathIndex !== endPathIndex) {
        for (let i = startPathIndex; i < endPathIndex; i += 1) {
          const nextVertex = paths[i].to;
          vertex(nextVertex.x, nextVertex.y);
        }
      }
      drawVertexOnPath(paths[endPathIndex], endPathRatio);
      endShape();
    };
  };

  // -- rectangle & square ----

  const createRectangleCorner = (x, y, width, height) => {
    const x2 = x + width;
    const y2 = y + height;
    return createPolygon([
      { x, y },
      { x: x2, y },
      { x: x2, y: y2 },
      { x, y: y2 }
    ]);
  };

  const createRectangleCenter = (x, y, width, height) => {
    const halfWidth = 0.5 * width;
    const halfHeight = 0.5 * height;
    const x1 = x - halfWidth;
    const y1 = y - halfHeight;
    const x2 = x + halfWidth;
    const y2 = y + halfHeight;
    return createPolygon([
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 }
    ]);
  };

  const createSquareCorner = (x, y, size) =>
    createRectangleCorner(x, y, size, size);

  const createSquareCenter = (x, y, size) =>
    createRectangleCenter(x, y, size, size);

  return {
    Line: {
      draw: line,
      create: createLine
    },
    Ellipse: {
      draw: ellipse,
      create: createEllipse
    },
    Circle: {
      draw: circle,
      create: createCircle
    },
    Polygon: {
      /**
       * Creates a function for drawing trimmed 2D polygon through `vertices`.
       * @param vertices - Array of objects with `x` and `y` coordinates.
       * @returns Function for drawing trimmed 2D polygon.
       */
      create: createPolygon
    },
    Rectangle: {
      createCorner: createRectangleCorner,
      createCenter: createRectangleCenter
    },
    Square: {
      createCorner: createSquareCorner,
      createCenter: createSquareCenter
    }
  };
})();

// ---- example ---------------------------------------------------------------

// -- shape functions ----

const rotationVelocity = 0.01;
const createRotatingShape = (x, y, shape) => {
  let rotationAngle = random(TWO_PI);

  return (startRatio, endRatio) => {
    push();
    translate(x, y);
    rotate(rotationAngle);
    shape(startRatio, endRatio);
    pop();

    rotationAngle += rotationVelocity;
  };
};

const createRandomEllipse = () => {
  const sizeX = random(40, 80);
  const sizeY = random(40, 80);

  return TrimmedShape.Ellipse.create(0, 0, sizeX, sizeY);
};

const createRandomRect = () => {
  const sizeX = random(30, 70);
  const sizeY = random(30, 70);

  return TrimmedShape.Rectangle.createCenter(0, 0, sizeX, sizeY);
};

const createRandomTriangle = () => {
  const TAU_THIRDS = TWO_PI / 3;
  const vertices = [0, 1, 2].map(index => {
    const angle = index * TAU_THIRDS + random(-1, 1) * QUARTER_PI;
    const distance = random(25, 45);
    return {
      x: distance * cos(angle),
      y: distance * sin(angle)
    };
  });

  return TrimmedShape.Polygon.create(vertices);
};

const createRandomPolygon = () => {
  const angleInterval = TWO_PI / 5;
  const randomAngleMagnitude = angleInterval / 3;
  const vertices = Array.from({ length: 5 }, (_, index) => {
    const angle = index * angleInterval + random(-1, 1) * randomAngleMagnitude;
    const distance = random(15, 50);
    return {
      x: distance * cos(angle),
      y: distance * sin(angle)
    };
  });

  return TrimmedShape.Polygon.create(vertices);
};

const shapeCreators = [
  createRandomEllipse,
  createRandomRect,
  createRandomTriangle,
  createRandomPolygon
];

// -- variable & other functions ----

const shapes = [];
const animationDuration = 120;
const resetIntervalDuration = animationDuration * 2;

const reset = () => {
  shapes.length = 0;

  for (let y = 85; y < height - 50; y += 100) {
    for (let x = 120; x < width - 50; x += 100) {
      const repetition = random() < 0.5 ? 2 : 1;
      for (let i = 0; i < repetition; i += 1) {
        const createShape = random(shapeCreators);
        shapes.push(createRotatingShape(x, y, createShape()));
      }
    }
  }
};

const calculateTrimmingRatios = frameCount => {
  const progressRatio = (frameCount % animationDuration) / animationDuration;

  if (progressRatio < 0.5)
    return {
      startRatio: 0,
      endRatio: 2 * progressRatio
    };

  return {
    startRatio: 2 * (progressRatio - 0.5),
    endRatio: 1
  };
};

// -- main ----

setup = () => {
  createCanvas(640, 480);
  stroke(96, 192, 255);
  noFill();
  strokeWeight(2);

  reset();
};

draw = () => {
  background(252, 253, 255);

  if (frameCount % resetIntervalDuration === 0) reset();

  const { startRatio, endRatio } = calculateTrimmingRatios(frameCount);
  for (const shape of shapes) shape(startRatio, endRatio);
};
