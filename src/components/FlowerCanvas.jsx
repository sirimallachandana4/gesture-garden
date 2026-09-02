import { useEffect, useRef } from "react";
import { createFlower } from "../utils/flower";
import { drawFlower } from "../utils/drawFlower";

function FlowerCanvas({
  hand,
  mode,
  writingColor = "#FF4F87",
  colorPickerOpen = false,
}) {
  const canvasRef = useRef(null);

  // =====================================================
  // LATEST HAND DATA
  // =====================================================

  const handRef = useRef(hand);
  const modeRef = useRef(mode);

  useEffect(() => {
    handRef.current = hand;
  }, [hand]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // =====================================================
  // FLOWERS
  // =====================================================

  const flowersRef = useRef([]);

  const previousPosition = useRef(null);
  const smoothPosition = useRef(null);
  const lastFlowerPosition = useRef(null);
  const previousGesture = useRef("None");

  // =====================================================
  // WRITE MODE
  // =====================================================

  const strokesRef = useRef([]);
  const currentStrokeRef = useRef(null);

  const previousWritePosition = useRef(null);
  const smoothWritePosition = useRef(null);

  // =====================================================
  // THROW FLOWERS
  // =====================================================

  function releaseFlowers(handX, handY) {
  flowersRef.current.forEach((flower) => {
    if (flower.released) {
      return;
    }

    flower.released = true;

    // Direction from the hand toward the flower
    const dx = flower.x - handX;
    const dy = flower.y - handY;

    const distance =
      Math.sqrt(dx * dx + dy * dy) || 1;

    const directionX =
      dx / distance;

    const directionY =
      dy / distance;

    // Natural outward burst
    const burstPower =
      2.5 + Math.random() * 2.5;

    flower.velocityX =
      directionX * burstPower +
      (Math.random() - 0.5) * 2;

    // Strong upward movement + outward direction
    flower.velocityY =
  -3.5 -
  Math.random() * 2.5 +
  directionY * 1.2;

    // Individual rotation
    flower.rotationSpeed =
      (Math.random() - 0.5) * 0.12;
  });
}

  // =====================================================
  // ERASE FLOWERS
  // =====================================================

  function eraseFlowersAt(x, y) {
    const eraseRadius = 80;

    flowersRef.current =
      flowersRef.current.filter((flower) => {
        // Let already-thrown flowers continue falling.
        if (flower.released) {
          return true;
        }

        const dx = flower.x - x;
        const dy = flower.y - y;

        const distance =
          Math.sqrt(dx * dx + dy * dy);

        return distance > eraseRadius;
      });
  }

  // =====================================================
  // ERASE WRITING
  // =====================================================

  function eraseWritingAt(x, y) {
  const eraseRadius = 65;
  const newStrokes = [];

  strokesRef.current.forEach((stroke) => {
    if (!stroke || !stroke.points) {
      return;
    }

    let currentPart = [];

    stroke.points.forEach((point) => {
      const dx = point.x - x;
      const dy = point.y - y;

      const distance =
        Math.sqrt(dx * dx + dy * dy);

      if (distance > eraseRadius) {
        currentPart.push(point);
      } else {
        if (currentPart.length > 1) {
          newStrokes.push({
            color: stroke.color,
            points: currentPart,
          });
        }

        currentPart = [];
      }
    });

    if (currentPart.length > 1) {
      newStrokes.push({
        color: stroke.color,
        points: currentPart,
      });
    }
  });

  strokesRef.current = newStrokes;
}

  // =====================================================
  // RESET DRAWING POSITION
  // =====================================================

  function resetFlowerPosition() {
    previousPosition.current = null;
    smoothPosition.current = null;
    lastFlowerPosition.current = null;
  }

  function resetWritePosition() {
    previousWritePosition.current = null;
    smoothWritePosition.current = null;
    currentStrokeRef.current = null;
  }

  // =====================================================
  // MODE CHANGED
  // =====================================================

  useEffect(() => {
    resetFlowerPosition();
    resetWritePosition();

    previousGesture.current = "None";
  }, [mode]);

  // =====================================================
  // HAND INTERACTION
  // =====================================================

  useEffect(() => {
    if (!hand?.detected) {
      resetFlowerPosition();
      resetWritePosition();

      previousGesture.current = "None";

      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    // =================================================
    // INDEX FINGER POSITION
    // =================================================

    const rawX =
      (1 - hand.x) * canvas.width;

    const rawY =
      hand.y * canvas.height;

    // =====================================================
// FLOWER MODE
// =====================================================

if (mode === "FLOWERS") {
  // ---------------------------------------------
  // SMOOTH FINGER
  // ---------------------------------------------

  if (!smoothPosition.current) {
    smoothPosition.current = {
      x: rawX,
      y: rawY,
    };
  }

  const smoothing = 0.92;

  smoothPosition.current.x +=
    (rawX - smoothPosition.current.x) *
    smoothing;

  smoothPosition.current.y +=
    (rawY - smoothPosition.current.y) *
    smoothing;

  const x = smoothPosition.current.x;
  const y = smoothPosition.current.y;

  // =================================================
  // OPEN PALM = THROW ONLY
  // =================================================

  if (hand.gesture === "Open_Palm") {
    // IMPORTANT:
    // Never create flowers while palm is open.
    resetFlowerPosition();

    // Throw only once when palm opens.
    if (
      previousGesture.current !== "Open_Palm"
    ) {
      releaseFlowers(x, y);
    }

    previousGesture.current = "Open_Palm";

    return;
  }

  // =================================================
  // FIST = ERASE
  // =================================================

  if (
    hand.gesture === "Closed_Fist" ||
    hand.gesture === "Fist"
  ) {
    eraseFlowersAt(x, y);

    resetFlowerPosition();

    previousGesture.current =
      hand.gesture;

    return;
  }

  if (
  hand.gesture === "Victory" ||
  colorPickerOpen
) {
  resetWritePosition();

  previousGesture.current =
    hand.gesture;

  return;
}

  // =================================================
  // IMPORTANT:
  // AFTER OPEN PALM, DON'T CREATE A FLOWER
  // FROM THE JUMP TO THE NEW FINGER POSITION.
  // Start a completely new drawing point.
  // =================================================

  if (
    previousGesture.current === "Open_Palm"
  ) {
    previousPosition.current = {
      x,
      y,
    };

    lastFlowerPosition.current = {
      x,
      y,
    };

    previousGesture.current =
      hand.gesture;

    return;
  }

  // =================================================
  // DRAW FLOWERS WHILE MOVING
  // =================================================

  const previous =
    previousPosition.current;

  if (!previous) {
    previousPosition.current = {
      x,
      y,
    };

    lastFlowerPosition.current = {
      x,
      y,
    };

    previousGesture.current =
      hand.gesture;

    return;
  }

  const dx = x - previous.x;
  const dy = y - previous.y;

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );

  if (distance >= 1) {
    const last =
      lastFlowerPosition.current ||
      previous;

    const flowerDX =
      x - last.x;

    const flowerDY =
      y - last.y;

    const flowerDistance =
      Math.sqrt(
        flowerDX * flowerDX +
        flowerDY * flowerDY
      );

    const spacing = 4;

    if (flowerDistance >= spacing) {
      const steps =
        Math.max(
          1,
          Math.ceil(
            flowerDistance / spacing
          )
        );

      for (
        let i = 1;
        i <= steps;
        i++
      ) {
        const progress =
          i / steps;

        const flowerX =
          last.x +
          flowerDX * progress;

        const flowerY =
          last.y +
          flowerDY * progress;

        const flower =
          createFlower(
            flowerX,
            flowerY
          );

        flowersRef.current.push(
          flower
        );
      }

      lastFlowerPosition.current = {
        x,
        y,
      };
    }
  }

  previousPosition.current = {
    x,
    y,
  };

  previousGesture.current =
    hand.gesture;

  return;
}

    // =====================================================
    // WRITE MODE
    // =====================================================

    if (mode === "WRITE") {
      if (!smoothWritePosition.current) {
        smoothWritePosition.current = {
          x: rawX,
          y: rawY,
        };
      }

      const smoothing = 0.88;

      smoothWritePosition.current.x +=
        (
          rawX -
          smoothWritePosition.current.x
        ) * smoothing;

      smoothWritePosition.current.y +=
        (
          rawY -
          smoothWritePosition.current.y
        ) * smoothing;

      const x =
        smoothWritePosition.current.x;

      const y =
        smoothWritePosition.current.y;

      // =================================================
      // FIST = ERASE WRITING
      // =================================================

      if (
        hand.gesture === "Closed_Fist" ||
        hand.gesture === "Fist"
      ) {
        eraseWritingAt(x, y);

        resetWritePosition();

        previousGesture.current =
          hand.gesture;

        return;
      }

      // =================================================
      // OPEN PALM = STOP CURRENT STROKE
      // =================================================

      if (hand.gesture === "Open_Palm") {
        resetWritePosition();

        previousGesture.current =
          "Open_Palm";

        return;
      }

      // =================================================
      // START WRITING
      // =================================================

      if (!previousWritePosition.current) {
        const newStroke = {
  color: writingColor,
  points: [{ x, y }],
};

strokesRef.current.push(
  newStroke
);

currentStrokeRef.current =
  newStroke;

        previousWritePosition.current = {
          x,
          y,
        };

        previousGesture.current =
          hand.gesture;

        return;
      }

      // =================================================
      // CONTINUE WRITING
      // =================================================

      const previous =
        previousWritePosition.current;

      const dx =
        x - previous.x;

      const dy =
        y - previous.y;

      const distance =
        Math.sqrt(
          dx * dx +
            dy * dy
        );

      if (distance >= 2) {
        if (!currentStrokeRef.current) {
  const newStroke = {
    color: writingColor,
    points: [],
  };

  strokesRef.current.push(
    newStroke
  );

  currentStrokeRef.current =
    newStroke;
}

currentStrokeRef.current.points.push({
  x,
  y,
});

        previousWritePosition.current = {
          x,
          y,
        };
      }

      previousGesture.current =
        hand.gesture;
    }
  }, [
  hand,
  mode,
  writingColor,
  colorPickerOpen,
]);

  // =====================================================
  // MAIN CANVAS ANIMATION
  // =====================================================

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    // =================================================
    // RESIZE
    // =================================================

    function resize() {
      canvas.width =
        window.innerWidth;

      canvas.height =
        window.innerHeight;
    }

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    let animationId;

    // =================================================
    // ANIMATION LOOP
    // =================================================

    function animate() {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const latestHand =
        handRef.current;

      const currentMode =
        modeRef.current;

      // =================================================
      // WRITE MODE DRAWING
      // =================================================

      if (currentMode === "WRITE") {
        drawWriting(
          ctx,
          strokesRef.current
        );
      }

      // =================================================
      // FLOWERS
      // =================================================

      flowersRef.current.forEach(
        (flower) => {
          // -----------------------------------------
          // Flowers sitting on drawing
          // -----------------------------------------

          if (!flower.released) {
            flower.floatPhase +=
              flower.floatSpeed;

            flower.floatX =
  Math.sin(
    flower.floatPhase
  ) * flower.floatAmount;

flower.floatY =
  Math.cos(
    flower.floatPhase
  ) * flower.floatAmount;
          }

          // -----------------------------------------
          // Released flowers
          // -----------------------------------------

          if (flower.released) {
            flower.velocityY +=
              flower.gravity;

            flower.x +=
              flower.velocityX;

            flower.y +=
              flower.velocityY;

            flower.x +=
  Math.sin(
    flower.sway
  ) * flower.swayAmount;

            flower.sway +=
              flower.swaySpeed;

            flower.rotation +=
              flower.rotationSpeed;

            flower.velocityX *=
              flower.airResistance;
          }

          ctx.save();

          ctx.translate(
            flower.floatX || 0,
            flower.floatY || 0
          );

          drawFlower(
            ctx,
            flower
          );

          ctx.restore();
        }
      );

      // Remove flowers after they fall below screen.
      flowersRef.current =
        flowersRef.current.filter(
          (flower) =>
            !flower.released ||
            flower.y <
              canvas.height + 150
        );

      // =================================================
      // HAND SKELETON
      // =================================================

      if (
        latestHand?.detected &&
        latestHand.landmarks
      ) {
        drawHandSkeleton(
          ctx,
          latestHand.landmarks,
          canvas
        );
      }

      // =================================================
      // ERASER CIRCLE
      // =================================================

      if (
        latestHand?.detected &&
        (
          latestHand.gesture ===
            "Closed_Fist" ||
          latestHand.gesture ===
            "Fist"
        )
      ) {
        const eraserX =
          (1 - latestHand.x) *
          canvas.width;

        const eraserY =
          latestHand.y *
          canvas.height;

        drawEraser(
          ctx,
          eraserX,
          eraserY
        );
      }

      animationId =
        requestAnimationFrame(
          animate
        );
    }

    animate();

    return () => {
      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="flower-layer"
    />
  );
}

// =====================================================
// DRAW WRITING
// =====================================================

function drawWriting(ctx, strokes) {
  ctx.save();

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 8;

  ctx.shadowColor =
    "rgba(0,0,0,0.35)";

  ctx.shadowBlur = 4;

  strokes.forEach((stroke) => {
    if (!stroke) {
      return;
    }

    /*
     * New stroke format
     */
    const points = stroke.points;

    if (!points || points.length < 2) {
      return;
    }

    ctx.strokeStyle =
      stroke.color || "#FFFFFF";

    ctx.beginPath();

    ctx.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      let i = 1;
      i < points.length;
      i++
    ) {
      const previous =
        points[i - 1];

      const current =
        points[i];

      const midX =
        (
          previous.x +
          current.x
        ) / 2;

      const midY =
        (
          previous.y +
          current.y
        ) / 2;

      ctx.quadraticCurveTo(
        previous.x,
        previous.y,
        midX,
        midY
      );
    }

    const last =
      points[points.length - 1];

    ctx.lineTo(
      last.x,
      last.y
    );

    ctx.stroke();
  });

  ctx.restore();
}

// =====================================================
// DRAW ERASER CIRCLE
// =====================================================

function drawEraser(
  ctx,
  x,
  y
) {
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    55,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle =
    "rgba(255,255,255,0.9)";

  ctx.lineWidth = 3;

  ctx.setLineDash([
    8,
    8,
  ]);

  ctx.stroke();

  ctx.restore();
}

// =====================================================
// HAND SKELETON
// =====================================================

function drawHandSkeleton(ctx, landmarks, canvas) {
  const connections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],

    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8],

    [5, 9],
    [9, 10],
    [10, 11],
    [11, 12],

    [9, 13],
    [13, 14],
    [14, 15],
    [15, 16],

    [13, 17],
    [17, 18],
    [18, 19],
    [19, 20],

    [0, 17],
  ];

  const getPoint = (index) => {
    const point = landmarks[index];

    return {
      x: (1 - point.x) * canvas.width,
      y: point.y * canvas.height,
    };
  };

  ctx.save();

  /*
   * =====================================
   * CONNECTION GLOW
   * =====================================
   */

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.shadowColor = "rgba(100,255,180,0.8)";
  ctx.shadowBlur = 12;

  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(100,255,180,0.25)";

  connections.forEach(([a, b]) => {
    const p1 = getPoint(a);
    const p2 = getPoint(b);

    ctx.beginPath();

    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    ctx.stroke();
  });

  /*
   * =====================================
   * MAIN SKELETON
   * =====================================
   */

  ctx.shadowBlur = 4;

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(180,255,215,0.95)";

  connections.forEach(([a, b]) => {
    const p1 = getPoint(a);
    const p2 = getPoint(b);

    ctx.beginPath();

    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    ctx.stroke();
  });

  /*
   * =====================================
   * LANDMARK DOTS
   * =====================================
   */

  landmarks.forEach((point, index) => {
    const { x, y } = getPoint(index);

    const isIndexFinger = index === 8;

    ctx.save();

    if (isIndexFinger) {
      /*
       * Large glowing index fingertip
       */

      ctx.shadowColor = "rgba(255,100,170,1)";
      ctx.shadowBlur = 22;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        11,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(255,90,160,0.25)";
      ctx.fill();

      ctx.shadowBlur = 10;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        6,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "#ff5b9d";
      ctx.fill();

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        2.5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "#ffffff";
      ctx.fill();
    } else {
      /*
       * Normal landmarks
       */

      ctx.shadowColor = "rgba(255,255,255,0.7)";
      ctx.shadowBlur = 5;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        3.2,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(245,255,250,0.95)";

      ctx.fill();
    }

    ctx.restore();
  });

  ctx.restore();
}

export default FlowerCanvas;