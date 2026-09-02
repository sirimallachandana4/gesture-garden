import {
  useEffect,
  useRef,
} from "react";

function HandSkeleton({
  landmarks,
}) {
  const canvasRef =
    useRef(null);

  useEffect(() => {
    const canvas =
      canvasRef.current;

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

    if (!landmarks) {
      return;
    }

    const points =
      landmarks.map(
        (point) => ({
          x:
            (1 - point.x) *
            canvas.width,

          y:
            point.y *
            canvas.height,
        })
      );

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

    ctx.lineWidth = 2;

    ctx.strokeStyle =
      "rgba(255,255,255,0.7)";

    connections.forEach(
      ([a, b]) => {
        ctx.beginPath();

        ctx.moveTo(
          points[a].x,
          points[a].y
        );

        ctx.lineTo(
          points[b].x,
          points[b].y
        );

        ctx.stroke();
      }
    );

    points.forEach(
      (point) => {
        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          4,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          "#ff5c8a";

        ctx.fill();
      }
    );
  }, [landmarks]);

  return (
    <canvas
      ref={canvasRef}
      className="hand-layer"
    />
  );
}

export default HandSkeleton;