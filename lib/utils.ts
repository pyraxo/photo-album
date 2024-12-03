import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export function isPointInRotatedRect(point: Point, rect: Rect): boolean {
  // Adjust point relative to rectangle center
  const dx = point.x - rect.x;
  const dy = point.y - rect.y;

  // Un-rotate the point around the center of the rectangle
  const angle = -rect.rotation * (Math.PI / 180);
  const unrotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
  const unrotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);

  // Check if the un-rotated point is inside the rectangle
  return (
    Math.abs(unrotatedX) <= rect.width / 2 &&
    Math.abs(unrotatedY) <= rect.height / 2
  );
}
