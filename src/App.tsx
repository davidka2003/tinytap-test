import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { getShapeBoundingBox } from "./utils";
import { Shape } from "./canvas/shape";
import { CanvasState } from "./canvas/canvas-state";

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

const StyledSideBar = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledCanvas = styled.canvas`
  flex: 1 1 0;
  height: 100%;
`;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasState = useRef<CanvasState | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const getShapes = () => {
    return canvasState.current?.shapes ?? [];
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    const image = new Image();
    image.onload = () => {
      const _canvasState = new CanvasState(ctx!, image);
      canvasState.current = _canvasState;
    };
    image.crossOrigin = "anonymous";
    image.src = "/image.jpg";
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasState.current) {
      return;
    }

    canvasState.current.pushPointToState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
    setIsDrawing(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasState.current) {
      return;
    }
    canvasState.current.pushPointToState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
    canvasState.current.nextState();
    setShapes([...getShapes()]);
    setIsDrawing(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    if (!canvasState.current) {
      return;
    }
    canvasState.current.pushPointToState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
  };

  return (
    <StyledApp>
      <StyledSideBar>
        {shapes.map(
          (shape, index) =>
            shape.image && (
              <div
                key={index}
                onClick={() => {
                  canvasState.current?.deleteStage(index);
                  const shapes = getShapes();
                  console.log(shapes);
                  setShapes([...shapes]);
                }}
              >
                <img src={shape.image} alt="" />
              </div>
            )
        )}
      </StyledSideBar>
      <StyledCanvas
        width={1280}
        height={720}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
      ></StyledCanvas>
    </StyledApp>
  );
}

export default App;

function createCropPath(points: { x: number; y: number }[]) {
  const path = new Path2D();
  path.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }
  path.closePath();
  return path;
}

const getBoundingImageBox = (coords: { x: number; y: number }[]) => {
  let [minX, minY] = [Infinity, Infinity];
  let [maxX, maxY] = [0, 0];
  for (let index = 0; index < coords.length; index++) {
    const point = coords[index];
    minX = point.x <= minX ? point.x : minX;
    minY = point.y <= minY ? point.y : minY;

    maxX = point.x >= maxX ? point.x : maxX;
    maxY = point.y >= maxY ? point.y : maxY;
  }

  return {
    width: maxX - minX,
    heiht: maxY - minY,
    maxX,
    maxY,
    minX,
    minY,
  };
};
