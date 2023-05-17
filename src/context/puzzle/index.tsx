import { createContext, Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { CanvasState } from "../../canvas/canvas-state";
import { Puzzle } from "../../canvas/puzzle";

type UseStateT<T> = [T, Dispatch<SetStateAction<T>>];

export interface IPuzzleContext {
  currentCanvasState: React.MutableRefObject<CanvasState | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentImageState: UseStateT<HTMLImageElement | null>;
  isDrawingState: UseStateT<boolean>;
  imagesState: UseStateT<{ image: HTMLImageElement, id: string }[]>;
  puzzleState: UseStateT<Puzzle[]>;
  debugState: UseStateT<boolean>
  canvasDimenionsState: UseStateT<{ width: number, height: number }>
}
//@ts-expect-error
export const PuzzleContext = createContext<IPuzzleContext>({});

export const PuzzleContextProvider: FC<{ children: React.ReactNode, debug?: boolean }> = ({ children, debug: initialDebug = false }) => {
  const [images, setImages] = useState<{ image: HTMLImageElement, id: string }[]>([]);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasStateRef = useRef<CanvasState | null>(null);
  const [isDrawing, setIsDrawing] = useState(false)
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [debug, setDebug] = useState(initialDebug)
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number, height: number }>({ width: 1280, height: 600 })
  return (
    <PuzzleContext.Provider
      value={{
        canvasRef,
        currentCanvasState: canvasStateRef,
        currentImageState: [currentImage, setCurrentImage],
        imagesState: [images, setImages],
        isDrawingState: [isDrawing, setIsDrawing],
        puzzleState: [puzzles, setPuzzles],
        debugState: [debug, setDebug],
        canvasDimenionsState: [canvasDimensions, setCanvasDimensions]
      }}
    >{children}</PuzzleContext.Provider>
  );
};
