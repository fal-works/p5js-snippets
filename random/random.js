// ---- definition ------------------------------------------------------------

"use strict";

/**
 * Creates a collection of functions that return random values.
 * @param random - A function that returns a random value from `0` to (but not including) `1`. Defaults fo `Math.random`.
 * @returns Functions that return random values.
 */
const createRandomFunctions = (random = Math.random) => {
  const { floor } = Math;

  return {
    /**
     * Returns a random value from `0` to (but not including) `1`.
     * @returns A random ratio.
     */
    ratio: random,

    /**
     * Returns a random value from `0` to (but not including) `value`.
     * @param max
     * @returns A random value.
     */
    value: max => random() * max,

    /**
     * Returns a random value from `min` up to (but not including) `max`.
     * The case where `min > max` is not expected.
     * @param min
     * @param max
     * @returns A random integer value.
     */
    between: (min, max) => min + random() * (max - min),

    /**
     * Returns a random value from `0` to (but not including) `2 * PI`.
     * @returns A random radians value.
     */
    angle: () => random() * TWO_PI,

    /**
     * Returns a random integer from 0 up to (but not including) `maxInt`.
     * `maxInt` is not expected to be negative.
     * @param maxInt
     * @returns A random integer value.
     */
    integer: maxInt => floor(random() * maxInt),

    /**
     * Returns a random integer from `minInt` up to (but not including) `maxInt`.
     * The case where `minInt > maxInt` is not expected.
     * @param minInt
     * @param maxInt
     * @returns A random integer value.
     */
    integerBetween: (minInt, maxInt) =>
      minInt + floor(random() * (maxInt - minInt)),

    /**
     * Returns `n` or `-n` randomly.
     * @param n Any number.
     * @returns A random-signed value of `n`.
     */
    signed: n => (random() < 0.5 ? n : -n),

    /**
     * Removes and returns one element from `array` randomly.
     * `array` is not expected to be empty.
     * @param array
     * @returns A random element.
     */
    removeFromArray: array =>
      array.splice(floor(random() * array.length), 1)[0],

    /**
     * Returns `true` or `false` randomly.
     * @param probability A number between 0 and 1.
     * @returns `true` with the given `probability`.
     */
    bool: probability => random() < probability,

    /**
     * Returns a random value from `-absoluteValue` up to (but not including) `absoluteValue`.
     * @param absoluteValue
     * @returns A random value.
     */
    fromAbsolute: absoluteValue =>
      -absoluteValue + random() * 2 * absoluteValue,

    /**
     * Similar to `ratio()`, but remaps the result by `curve`.
     * @param curve Any function that takes a random value between [0, 1] and returns a remapped value.
     * @returns A random value.
     */
    ratioCurved: curve => curve(random()),

    /**
     * Similar to p5 `value()`, but remaps the result by `curve`.
     * @param curve Any function that takes a random value between [0, 1] and returns a remapped value.
     * @param magnitude
     * @returns A random value.
     */
    valueCurved: (curve, magnitude) => curve(random()) * magnitude,

    /**
     * Similar to `between()`, but remaps the result by `curve`.
     * `start` should not be greater than `end`.
     * @param curve Any function that takes a random value between [0, 1] and returns a remapped value.
     * @param start
     * @param end
     * @returns A random value.
     */
    betweenCurved: (curve, start, end) =>
      start + curve(random()) * (end - start)
  };
};
