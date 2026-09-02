export function drawFlower(ctx, flower) {
  const {
    x,
    y,
    size,
    color,
    rotation,
  } = flower;

  ctx.save();

  ctx.translate(x, y);

  ctx.rotate(rotation);

  // ==========================================
  // FIVE PETALS
  // ==========================================

  for (let i = 0; i < 5; i++) {
    const angle =
      (Math.PI * 2 * i) / 5 -
      Math.PI / 2;

    ctx.save();

    ctx.rotate(angle);

    // Petal
    ctx.beginPath();

    ctx.moveTo(
      0,
      -size * 0.08
    );

    ctx.bezierCurveTo(
      -size * 0.40,
      -size * 0.30,

      -size * 0.50,
      -size * 0.78,

      0,
      -size * 0.85
    );

    ctx.bezierCurveTo(
      size * 0.50,
      -size * 0.78,

      size * 0.40,
      -size * 0.30,

      0,
      -size * 0.08
    );

    ctx.closePath();

    ctx.fillStyle = color;

    ctx.fill();

    // Petal highlight
    ctx.beginPath();

    ctx.arc(
      -size * 0.12,
      -size * 0.50,
      size * 0.07,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      "rgba(255,255,255,0.5)";

    ctx.fill();

    ctx.restore();
  }

  // ==========================================
  // YELLOW CENTER
  // ==========================================

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    size * 0.23,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#FFD45C";

  ctx.fill();

  // ==========================================
  // CENTER DOTS
  // ==========================================

  for (let i = 0; i < 5; i++) {
    const angle =
      (Math.PI * 2 * i) / 5;

    const dotX =
      Math.cos(angle) *
      size *
      0.12;

    const dotY =
      Math.sin(angle) *
      size *
      0.12;

    ctx.beginPath();

    ctx.arc(
      dotX,
      dotY,
      size * 0.025,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      "#E9A32F";

    ctx.fill();
  }

  ctx.restore();
}