function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(
    dx * dx + dy * dy
  );
}

function fingerIsOpen(
  landmarks,
  tip,
  pip
) {
  return (
    landmarks[tip].y <
    landmarks[pip].y
  );
}

export function detectGesture(
  landmarks
) {
  if (
    !landmarks ||
    landmarks.length !== 21
  ) {
    return "NONE";
  }

  const indexOpen =
    fingerIsOpen(
      landmarks,
      8,
      6
    );

  const middleOpen =
    fingerIsOpen(
      landmarks,
      12,
      10
    );

  const ringOpen =
    fingerIsOpen(
      landmarks,
      16,
      14
    );

  const pinkyOpen =
    fingerIsOpen(
      landmarks,
      20,
      18
    );

  // --------------------------------
  // OPEN HAND
  // --------------------------------

  if (
    indexOpen &&
    middleOpen &&
    ringOpen &&
    pinkyOpen
  ) {
    return "OPEN";
  }

  // --------------------------------
  // FIST
  // --------------------------------

  if (
    !indexOpen &&
    !middleOpen &&
    !ringOpen &&
    !pinkyOpen
  ) {
    return "FIST";
  }

  // --------------------------------
  // INDEX FINGER
  // --------------------------------

  if (
    indexOpen &&
    !middleOpen &&
    !ringOpen &&
    !pinkyOpen
  ) {
    return "POINT";
  }

  // --------------------------------
  // PINCH
  // --------------------------------

  const pinchDistance =
    distance(
      landmarks[4],
      landmarks[8]
    );

  if (pinchDistance < 0.06) {
    return "PINCH";
  }

  return "NONE";
}