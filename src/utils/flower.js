const COLORS = [
  "#FF8FB3",
  "#FFB3C7",
  "#F7A6D2",
  "#C9A0FF",
  "#FFD166",
  "#FF9B71",
];

export function createFlower(x, y) {
  return {
    x,
    y,

    // =====================================
    // FLOWER APPEARANCE
    // =====================================

    size:
      9 + Math.random() * 6,

    color:
      COLORS[
        Math.floor(
          Math.random() * COLORS.length
        )
      ],

    rotation:
      Math.random() *
      Math.PI *
      2,

    // =====================================
    // RELEASE / FALL STATE
    // =====================================

    released: false,

    // Initial movement
    velocityX: 0,
    velocityY: 0,

    // Gravity
    gravity:
      0.28 +
      Math.random() * 0.045,

    // Air resistance
    airResistance:
      0.992 +
      Math.random() * 0.004,

    // =====================================
    // ROTATION
    // =====================================

    rotationSpeed:
      (Math.random() - 0.5) *
      0.045,

    // =====================================
    // NATURAL SIDE MOVEMENT
    // =====================================

    sway:
      Math.random() *
      Math.PI *
      2,

    swaySpeed:
      0.012 +
      Math.random() * 0.018,

    swayAmount:
      0.25 +
      Math.random() * 0.45,

    // =====================================
    // FLOATING BEFORE RELEASE
    // =====================================

    floatPhase:
      Math.random() *
      Math.PI *
      2,

    floatSpeed:
      0.008 +
      Math.random() * 0.012,

    floatAmount:
      0.3 +
      Math.random() * 0.5,

    floatX: 0,
    floatY: 0,
  };
}