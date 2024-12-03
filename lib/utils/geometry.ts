interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export function getRotatedRectBounds(rect: Rect) {
  const { x, y, width, height, rotation = 0 } = rect;

  // Convert rotation to radians
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Calculate corners
  const corners = [
    { x: -width / 2, y: -height / 2 },
    { x: width / 2, y: -height / 2 },
    { x: width / 2, y: height / 2 },
    { x: -width / 2, y: height / 2 }
  ].map(point => ({
    x: x + (point.x * cos - point.y * sin),
    y: y + (point.x * sin + point.y * cos)
  }));

  // Get bounds
  const xs = corners.map(c => c.x);
  const ys = corners.map(c => c.y);

  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys)
  };
} 