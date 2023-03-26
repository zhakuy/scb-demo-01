const Orientation = {
  rotateClockwise: function (orientation: number) {
    return (orientation + 1) % 4;
  },

  rotateCounterClockwise: function (orientation: number) {
    return (orientation + 3) % 4;
  },

  compose: function (orientation1: number, orientation2: number) {
    return (orientation1 + orientation2) % 4;
  },

  converOrientationToDeg: function (orientation: number) {
    return orientation === 0
      ? "0deg"
      : orientation === 1
      ? "90deg"
      : orientation === 2
      ? "180deg"
      : "270deg";
  },
};

export default Orientation;
