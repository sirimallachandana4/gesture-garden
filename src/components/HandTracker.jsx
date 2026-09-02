import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  GestureRecognizer,
} from "@mediapipe/tasks-vision";

function HandTracker({ onHandUpdate }) {
  const videoRef = useRef(null);
  const recognizerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  const [status, setStatus] = useState("Starting camera...");

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        setStatus("Opening camera...");

        const isMobile =
  /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent
  );

const stream =
  await navigator.mediaDevices.getUserMedia({
    video: isMobile
      ? {
          width: { ideal: 720 },
          height: { ideal: 1280 },
          facingMode: "user",
        }
      : {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
    audio: false,
  });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;

        if (!video) return;

        video.srcObject = stream;

        await new Promise((resolve) => {
          video.onloadedmetadata = resolve;
        });

        await video.play();

        setStatus("Loading hand tracking...");

        // IMPORTANT:
        // Load WASM from our own public folder.
        const vision =
          await FilesetResolver.forVisionTasks(
            "/mediapipe/wasm"
          );

        const recognizer =
          await GestureRecognizer.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath:
                  "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",

                delegate: "GPU",
              },

              runningMode: "VIDEO",

              numHands: 1,

              minHandDetectionConfidence: 0.5,

              minHandPresenceConfidence: 0.5,

              minTrackingConfidence: 0.5,
            }
          );

        if (cancelled) {
          recognizer.close();
          return;
        }

        recognizerRef.current = recognizer;

        setStatus("Show your hand ✋");

        processFrame();
      } catch (error) {
        console.error(
          "Gesture recognition error:",
          error
        );

        setStatus("Gesture recognition failed");

        onHandUpdate({
          landmarks: null,
          gesture: "None",
          confidence: 0,
          x: 0,
          y: 0,
          palmX: 0,
          palmY: 0,
          detected: false,
        });
      }
    }

    function processFrame() {
      if (cancelled) return;

      const video = videoRef.current;
      const recognizer = recognizerRef.current;

      if (
        !video ||
        !recognizer ||
        video.readyState < 2
      ) {
        animationRef.current =
          requestAnimationFrame(processFrame);

        return;
      }

      if (
        video.currentTime !==
        lastVideoTimeRef.current
      ) {
        lastVideoTimeRef.current =
          video.currentTime;

        try {
          const result =
            recognizer.recognizeForVideo(
              video,
              performance.now()
            );

          if (
            result.landmarks &&
            result.landmarks.length > 0
          ) {
            const landmarks =
              result.landmarks[0];

            // INDEX FINGER TIP
            const indexTip =
              landmarks[8];

            // PALM CENTER
            const wrist =
              landmarks[0];

            const indexMCP =
              landmarks[5];

            const pinkyMCP =
              landmarks[17];

            const palmX =
              (
                wrist.x +
                indexMCP.x +
                pinkyMCP.x
              ) / 3;

            const palmY =
              (
                wrist.y +
                indexMCP.y +
                pinkyMCP.y
              ) / 3;

            let gesture = "None";
            let confidence = 0;

            if (
              result.gestures &&
              result.gestures[0] &&
              result.gestures[0][0]
            ) {
              gesture =
                result.gestures[0][0]
                  .categoryName;

              confidence =
                result.gestures[0][0]
                  .score;
            }

            onHandUpdate({
              landmarks,

              // INDEX FINGER POSITION
              x: indexTip.x,
              y: indexTip.y,

              // PALM POSITION
              palmX,
              palmY,

              gesture,
              confidence,

              detected: true,
            });

            setStatus(
              `${gesture} · ${Math.round(
                confidence * 100
              )}%`
            );
          } else {
            onHandUpdate({
              landmarks: null,
              gesture: "None",
              confidence: 0,
              x: 0,
              y: 0,
              palmX: 0,
              palmY: 0,
              detected: false,
            });

            setStatus("Show your hand ✋");
          }
        } catch (error) {
          console.error(
            "Recognition frame error:",
            error
          );
        }
      }

      animationRef.current =
        requestAnimationFrame(processFrame);
    }

    initialize();

    return () => {
      cancelled = true;

      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (recognizerRef.current) {
        recognizerRef.current.close();
        recognizerRef.current = null;
      }
    };
  }, [onHandUpdate]);

  return (
    <div className="camera-layer">
      <video
        ref={videoRef}
        className="camera-full"
        autoPlay
        muted
        playsInline
      />

      <div className="tracking-status">
        {status}
      </div>
    </div>
  );
}

export default HandTracker;