import { useEffect, useRef } from "react";

function GardenCanvas({
  hand,
  mode,
}) {
  const canvasRef = useRef(null);

  const flowersRef = useRef([]);

  const previousPositionRef = useRef(null);

  const wasOpenRef = useRef(false);

  const animationRef = useRef(null);

  const createFlower = (x, y) => {
    const flowers = flowersRef.current;

    flowers.push({
      x,
      y,

      size: 12 + Math.random() * 16,

      velocityX:
        (Math.random() - 0.5) * 1.5,

      velocityY:
        Math.random() * 0.5,

      gravity:
        0.015 + Math.random() * 0.025,

      rotation:
        Math.random() * Math.PI * 2,

      rotationSpeed:
        (Math.random() - 0.5) * 0.04,

      sway:
        Math.random() * Math.PI * 2,

      released: false,

      life: 1,
    });
  };

  const releaseFlowers = () => {
    flowersRef.current.forEach(
      (flower) => {
        flower.released = true;

        flower.velocityX +=
          (Math.random() - 0.5) * 2;

        flower.velocityY =
          Math.random() * 1.5;
      }
    );
  };

  const drawFlower = (
    ctx,
    flower
  ) => {
    ctx.save();

    ctx.translate(
      flower.x,
      flower.y
    );

    ctx.rotate(
      flower.rotation
    );

    const size = flower.size;

    /*
      Petals
    */

    for (let i = 0; i < 5; i++) {
      const angle =
        (Math.PI * 2 * i) / 5;

      const px =
        Math.cos(angle) * size * 0.55;

      const py =
        Math.sin(angle) * size * 0.55;

      ctx.beginPath();

      ctx.ellipse(
        px,
        py,
        size * 0.42,
        size * 0.7,
        angle,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        flower.color || "#ff8fab";

      ctx.fill();
    }

    /*
      Center
    */

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      size * 0.3,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "#ffd166";

    ctx.fill();

    ctx.restore();
  };

  const animate = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    canvas.width =
      window.innerWidth;

    canvas.height =
      window.innerHeight;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const flowers =
      flowersRef.current;

    flowers.forEach((flower) => {
      if (flower.released) {
        /*
          Paper-like falling movement
        */

        flower.velocityY +=
          flower.gravity;

        flower.y +=
          flower.velocityY;

        flower.x +=
          flower.velocityX;

        flower.x +=
          Math.sin(
            flower.sway
          ) * 0.5;

        flower.sway += 0.03;

        flower.rotation +=
          flower.rotationSpeed;
      }

      drawFlower(
        ctx,
        flower
      );
    });

    /*
      Remove flowers that
      have fallen below screen
    */

    flowersRef.current =
      flowers.filter(
        (flower) =>
          flower.y <
          canvas.height + 100
      );

    animationRef.current =
      requestAnimationFrame(
        animate
      );
  };

  useEffect(() => {
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!hand?.detected) {
      previousPositionRef.current =
        null;

      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    /*
      MediaPipe coordinates
      are normalized 0 → 1.
    */

    const x =
      (1 - hand.x) *
      canvas.width;

    const y =
      hand.y *
      canvas.height;

    /*
      FLOWER CREATION

      Move/rub your hand
      across the screen.
    */

    if (
      mode === "FLOWERS" &&
      hand.gesture !== "OPEN"
    ) {
      if (
        previousPositionRef.current
      ) {
        const previous =
          previousPositionRef.current;

        const dx =
          x - previous.x;

        const dy =
          y - previous.y;

        const movement =
          Math.sqrt(
            dx * dx +
            dy * dy
          );

        /*
          Only create flowers
          when the hand actually
          moves.
        */

        if (movement > 8) {
          createFlower(
            x,
            y
          );
        }
      }

      previousPositionRef.current = {
        x,
        y,
      };
    }

    /*
      OPEN HAND

      Release all flowers.
    */

    if (
      hand.gesture === "OPEN" &&
      !wasOpenRef.current
    ) {
      releaseFlowers();
    }

    wasOpenRef.current =
      hand.gesture === "OPEN";
  }, [hand, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="garden-canvas"
    />
  );
}

export default GardenCanvas;