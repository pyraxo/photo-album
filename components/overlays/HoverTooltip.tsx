'use client';

interface HoverTooltipProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  mouseX: number;
  mouseY: number;
  type: 'image' | 'pin';
  color?: string;
}

export function HoverTooltip({ x, y, width, height, rotation, mouseX, mouseY, type, color }: HoverTooltipProps) {
  return (
    <div
      className="fixed bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none z-[100]"
      style={{
        left: mouseX + 16,
        top: mouseY + 16,
      }}
    >
      <div className="space-y-0.5">
        <div>Position: ({Math.round(x)}, {Math.round(y)})</div>
        {type === 'image' && width && height && (
          <>
            <div>Size: {Math.round(width)}×{Math.round(height)}</div>
          </>
        )}
        {type === 'pin' && color && (
          <div>Color: {color}</div>
        )}
      </div>
    </div>
  );
} 