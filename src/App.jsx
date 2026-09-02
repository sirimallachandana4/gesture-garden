import { useCallback, useEffect, useRef, useState } from "react";
import HandTracker from "./components/HandTracker";
import FlowerCanvas from "./components/FlowerCanvas";

const WRITING_COLORS = [
  "#FF4F87",
  "#FF8A65",
  "#FFD166",
  "#65E6A5",
  "#5EC8FF",
  "#9B7BFF",
  "#FFFFFF",
];

function App() {
  const [mode, setMode] = useState("FLOWERS");

  const [hand, setHand] = useState({
    landmarks: null,
    gesture: "None",
    confidence: 0,
    x: 0,
    y: 0,
    palmX: 0,
    palmY: 0,
    detected: false,
  });

  const [selectedColor, setSelectedColor] =
    useState("#FF4F87");

  const [showColors, setShowColors] =
    useState(false);

  const previousGesture = useRef("None");
  const colorRefs = useRef([]);
const hoverColorRef = useRef(null);
const hoverStartRef = useRef(0);

  const handleHandUpdate = useCallback((data) => {
    setHand(data);
  }, []);

  /*
   * =====================================
   * TWO FINGERS → OPEN COLOR PALETTE
   * =====================================
   */

  useEffect(() => {
  const gesture = hand?.gesture || "None";

  /*
   * =====================================
   * ✌️ TWO FINGERS → OPEN COLOR PALETTE
   * =====================================
   */

  if (
    mode === "WRITE" &&
    gesture === "Victory" &&
    previousGesture.current !== "Victory"
  ) {
    setShowColors(true);

    hoverColorRef.current = null;
    hoverStartRef.current = 0;
  }

  previousGesture.current = gesture;
}, [hand?.gesture, mode]);

useEffect(() => {
  if (!showColors || mode !== "WRITE") {
    hoverColorRef.current = null;
    hoverStartRef.current = 0;
    return;
  }

  /*
   * Only use the index finger
   */
  if (hand?.gesture !== "Pointing_Up") {
    hoverColorRef.current = null;
    hoverStartRef.current = 0;
    return;
  }

  const screenX =
    (1 - hand.x) * window.innerWidth;

  const screenY =
    hand.y * window.innerHeight;

  let hoveredColor = null;

  colorRefs.current.forEach((element, index) => {
    if (!element) return;

    const rect =
      element.getBoundingClientRect();

    if (
      screenX >= rect.left &&
      screenX <= rect.right &&
      screenY >= rect.top &&
      screenY <= rect.bottom
    ) {
      hoveredColor =
        WRITING_COLORS[index];
    }
  });

  if (!hoveredColor) {
    hoverColorRef.current = null;
    hoverStartRef.current = 0;
    return;
  }

  /*
   * Finger moved to a different color
   */
  if (
    hoverColorRef.current !==
    hoveredColor
  ) {
    hoverColorRef.current =
      hoveredColor;

    hoverStartRef.current =
      performance.now();

    return;
  }

  /*
   * Hold over color for 0.7 seconds
   */
  const elapsed =
    performance.now() -
    hoverStartRef.current;

  if (elapsed >= 700) {
    setSelectedColor(hoveredColor);
    setShowColors(false);

    hoverColorRef.current = null;
    hoverStartRef.current = 0;
  }
}, [
  hand,
  showColors,
  mode,
]);

  /*
   * =====================================
   * CHANGE COLOR
   * =====================================
   */

  function handleColorSelect(color) {
    setSelectedColor(color);
    setShowColors(false);
  }

  /*
   * =====================================
   * CHANGE MODE
   * =====================================
   */

  function handleModeChange(newMode) {
    setMode(newMode);
    setShowColors(false);
    previousGesture.current = "None";
  }

  return (
    <main className="gesture-app">
      <HandTracker
        onHandUpdate={handleHandUpdate}
      />

      <FlowerCanvas
        hand={hand}
        mode={mode}
        writingColor={selectedColor}
        colorPickerOpen={showColors}
      />

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            🌸
          </div>

          <div>
            <h1>Gesture Garden</h1>
            <p>Bring your hands to life</p>
          </div>
        </div>

        <div className="live-status">
          <span className="status-dot"></span>
          LIVE
        </div>
      </header>

      {/* =====================================
          COLOR PALETTE
      ===================================== */}

      {mode === "WRITE" && showColors && (
        <div className="color-picker">
          <div className="color-picker-title">
            🎨 Choose your color
          </div>

          <div className="color-options">
  {WRITING_COLORS.map(
    (color, index) => (
      <button
        key={color}
        ref={(element) => {
          colorRefs.current[index] =
            element;
        }}
        className={
          selectedColor === color
            ? "color-option selected"
            : "color-option"
        }
        style={{
          "--color": color,
        }}
        onClick={() =>
          handleColorSelect(color)
        }
        aria-label={`Select ${color}`}
      />
    )
  )}
</div>

          <div className="color-hint">
            Choose a color to continue writing
          </div>
        </div>
      )}

      {/* =====================================
          INSTRUCTIONS
      ===================================== */}

      <div className="instruction-card">
        {mode === "FLOWERS" ? (
          <>
            <div className="instruction-title">
              🌸 Flower Garden
            </div>

            <div className="instruction-row">
              <span>☝️</span>
              <span>
                Move your finger to grow flowers
              </span>
            </div>

            <div className="instruction-row">
              <span>✋</span>
              <span>
                Open your palm to release them
              </span>
            </div>

            <div className="instruction-row">
              <span>✊</span>
              <span>
                Make a fist to erase
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="instruction-title">
              ✍️ Writing Canvas
            </div>

            <div className="instruction-row">
              <span>☝️</span>
              <span>
                Use your index finger to write
              </span>
            </div>

            <div className="instruction-row">
              <span>✌️</span>
              <span>
  ✌️ Open colors • ☝️ Point & hold to choose
</span>
            </div>

            <div className="instruction-row">
              <span>✊</span>
              <span>
                Make a fist to erase
              </span>
            </div>
          </>
        )}
      </div>

      {/* =====================================
          MODE SELECTOR
      ===================================== */}

      <div className="mode-panel">
        <button
          className={
            mode === "FLOWERS"
              ? "mode-button active"
              : "mode-button"
          }
          onClick={() =>
            handleModeChange("FLOWERS")
          }
        >
          <span>🌸</span>
          Flowers
        </button>

        <button
          className={
            mode === "WRITE"
              ? "mode-button active"
              : "mode-button"
          }
          onClick={() =>
            handleModeChange("WRITE")
          }
        >
          <span>✍️</span>
          Write
        </button>
      </div>

      {/* =====================================
          BOTTOM HINT
      ===================================== */}

      <div className="bottom-hint">
        <span>Move your hand</span>

        <span className="hint-line"></span>

        <span>
          Create something beautiful
        </span>
      </div>
    </main>
  );
}

export default App;