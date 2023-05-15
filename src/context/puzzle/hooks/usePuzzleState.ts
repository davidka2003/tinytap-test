import { useContext } from "react";
import { PuzzleContext } from "..";

export const usePuzzleState = () => {
  const { canvasRef, currentCanvasState, currentImageState, imagesState } = useContext(PuzzleContext);
  const [images, setImages] = imagesState;
  const [currentImage, setCurrentImage] = currentImageState;

  return {
    canvasRef,
    currentCanvasState,
  };
};
