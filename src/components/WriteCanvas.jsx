import { useEffect, useRef } from "react";

function WriteCanvas({ hand, mode }) {
  const canvasRef = useRef(null);

  const previousPosition =
    useRef(null);

  const smoothPosition =
    useRef(null);

  // =====================================================
  // DRAWING
  // =====================================================

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

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

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  // =====================================================
  // HAND ACTION
  // =====================================================

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    // ===================================================
    // NOT WRITE MODE
    // ===================================================

    if (mode !== "WRITE") {
      previousPosition.current =
        null;

      smoothPosition.current =
        null;

      return;
    }

    // ===================================================
    // NO HAND
    // ===================================================

    if (!hand?.detected) {
      previousPosition.current =
        null;

      smoothPosition.current =
        null;

      return;
    }

    // ===================================================
    // FIST = ERASER
    // ===================================================

    if (
      hand.gesture ===
      "Closed_Fist"
    ) {
      previousPosition.current =
        null;

      // -----------------------------------------------
      // PALM CENTER
      // -----------------------------------------------

      const palmX =
        (1 - hand.palmX) *
        canvas.width;

      const palmY =
        hand.palmY *
        canvas.height;

      // -----------------------------------------------
      // ERASER
      // -----------------------------------------------

      ctx.save();

      ctx.globalCompositeOperation =
        "destination-out";

      ctx.beginPath();

      ctx.arc(
        palmX,
        palmY,
        55,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();

      smoothPosition.current =
        null;

      return;
    }

    // ===================================================
    // ONLY INDEX FINGER = WRITE
    // ===================================================

    if (
      hand.gesture !==
      "Writing"
    ) {
      previousPosition.current =
        null;

      smoothPosition.current =
        null;

      return;
    }

    // ===================================================
    // INDEX FINGER POSITION
    // ===================================================

    const rawX =
      (1 - hand.indexX) *
      canvas.width;

    const rawY =
      hand.indexY *
      canvas.height;

    // ===================================================
    // SMOOTH INDEX
    // ===================================================

    if (!smoothPosition.current) {
      smoothPosition.current = {
        x: rawX,
        y: rawY,
      };
    }

    const smoothing = 0.65;

    smoothPosition.current.x +=
      (rawX -
        smoothPosition.current.x) *
      smoothing;

    smoothPosition.current.y +=
      (rawY -
        smoothPosition.current.y) *
      smoothing;

    const x =
      smoothPosition.current.x;

    const y =
      smoothPosition.current.y;

    // ===================================================
    // NEW WRITING STROKE
    // ===================================================

    if (!previousPosition.current) {
      previousPosition.current = {
        x,
        y,
      };

      return;
    }

    // ===================================================
    // DRAW
    // ===================================================

    const previous =
      previousPosition.current;

    const distance = Math.sqrt(
      Math.pow(
        x - previous.x,
        2
      ) +
        Math.pow(
          y - previous.y,
          2
        )
    );

    if (distance > 1.5) {
      ctx.save();

      ctx.globalCompositeOperation =
        "source-over";

      ctx.strokeStyle =
        "#5b285f";

      ctx.lineWidth = 7;

      ctx.lineCap = "round";

      ctx.lineJoin = "round";

      ctx.beginPath();

      ctx.moveTo(
        previous.x,
        previous.y
      );

      ctx.lineTo(x, y);

      ctx.stroke();

      ctx.restore();

      previousPosition.current = {
        x,
        y,
      };
    }
  }, [hand, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="write-layer"
    />
  );
}

export default WriteCanvas;