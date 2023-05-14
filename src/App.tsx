import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { getShapeBoundingBox } from "./utils";
import { Shape } from "./canvas/shape";

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
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    setCanvasContext(ctx);
    const image = new Image();
    image.onload = () => {
      setImage(image);
      attachImageToCanvas(image, ctx!);
      // ctx!.clearRect(0, 0, ctx!.canvas.width, ctx!.canvas.height);
      // ctx!.drawImage(image, 0, 0, ctx!.canvas.width, ctx!.canvas.height);
    };
    image.crossOrigin = "anonymous";
    image.src = "/image.jpg";
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasContext) {
      return;
    }
    canvasContext.beginPath();
    canvasContext.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    const shape = new Shape();

    shape.pushPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setShapes((state) => [...state, shape]);
    setStartPoint({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });

    canvasContext.strokeStyle = "green";
    canvasContext.lineWidth = 5;
    setIsDrawing(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasContext) {
      return;
    }
    const currentShape = shapes.at(-1);
    if (!currentShape) {
      return;
    }

    canvasContext.lineTo(startPoint.x, startPoint.y);

    currentShape.pushPoint(startPoint);

    canvasContext.stroke();
    canvasContext.save();
    canvasContext.clip();
    canvasContext.fillStyle = "gray";
    canvasContext.fill();
    canvasContext.restore();
    setStartPoint({ x: 0, y: 0 });

    currentShape.retrieveImage(image!, canvasContext.canvas.width, canvasContext.canvas.height);
    setIsDrawing(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    if (!canvasContext) {
      return;
    }

    const currentShape = shapes.at(-1);
    if (!currentShape) {
      return;
    }
    canvasContext.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvasContext.stroke();
    currentShape.pushPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const attachImageToCanvas = (image: CanvasImageSource, canvasContext: CanvasRenderingContext2D) => {
    if (!canvasContext) {
      console.log("no context");
      return;
    }
    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    canvasContext.drawImage(image, 0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
  };

  return (
    <StyledApp>
      <StyledSideBar>
        {shapes.map(
          (shape, index) =>
            shape.image && (
              <div key={index}>
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
