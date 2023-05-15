import { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CanvasState } from "../../canvas/canvas-state";

type UseStateT<T> = [T, Dispatch<SetStateAction<T>>];

export interface IPuzzleContext {
  currentCanvasState: React.RefObject<CanvasState | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentImageState: UseStateT<HTMLImageElement | null>;
  imagesState: UseStateT<string[]>;
}
//@ts-expect-error
export const PuzzleContext = createContext<IPuzzleContext>({});

export const PuzzleContextProvider = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasStateRef = useRef<CanvasState | null>(null);

  useEffect(() => {
    if (!currentImage) {
      return;
    }

    if (!canvasRef.current) {
      throw "Connect canvasRef to canvas";
    }
    const ctx = canvasRef.current.getContext("2d");
    const image = new Image();
    image.onload = () => {
      const _canvasState = new CanvasState(ctx!, image);
      canvasStateRef.current = _canvasState;
    };
    image.crossOrigin = "anonymous";
    image.src = "/image.jpg";
  }, [currentImage]);

  return (
    <PuzzleContext.Provider
      value={{
        canvasRef,
        currentCanvasState: canvasStateRef,
        currentImageState: [currentImage, setCurrentImage],
        imagesState: [images, setImages],
      }}
    ></PuzzleContext.Provider>
  );
};
