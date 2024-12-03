'use client';

import { useEffect, useRef } from 'react';
import { Engine, Render, World, Bodies, Body, Mouse, MouseConstraint } from 'matter-js';
import { usePhotoStore } from '@/lib/store';
import { DraggablePhoto } from './DraggablePhoto';

export function PhotoCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine>();
  const photos = usePhotoStore((state) => state.photos);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup Matter.js engine
    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(engine.world, mouseConstraint);

    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div ref={canvasRef} className="w-full h-full">
      {photos.map((photo) => (
        <DraggablePhoto key={photo.id} photo={photo} />
      ))}
    </div>
  );
}