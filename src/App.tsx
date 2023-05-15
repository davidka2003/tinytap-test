import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { getPolygonBoundingBox } from "./utils";
import { Shape } from "./canvas/shape";
import { CanvasState } from "./canvas/canvas-state";
import { PuzzleCard } from "./components";

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
`;

const StyledSideBar = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const StyledCanvas = styled.canvas`
  top: 0;
  position: sticky;
  flex: 1 1 0;
  height: 100%;
`;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasState = useRef<CanvasState | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
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
        <>
          {shapes.map(
            (shape, index) =>
              shape.image && (
                <PuzzleCard
                  canvasRect={canvasRef.current!.getBoundingClientRect()}
                  shape={shape}
                  initialHeight={shape.dimensions.height}
                  initialWidth={shape.dimensions.width}
                  deletePuzzle={() => {
                    canvasState.current?.deleteStage(index);
                    const shapes = getShapes();
                    setShapes([...shapes]);
                  }}
                  image={shape.image}
                  key={shape.id}
                  initialX={shape.coordinates.x}
                  initialY={shape.coordinates.y}
                />
              )
          )}
        </>
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
