import { useContext } from "react";
import { PuzzleContext } from "..";
import { CanvasState } from "../../../canvas/canvas-state";

export const usePuzzleState = () => {
  const { canvasRef, currentCanvasState, currentImageState, imagesState, isDrawingState, puzzleState, debugState } = useContext(PuzzleContext);
  const [images, setImages] = imagesState;
  const [currentImage, setCurrentImage] = currentImageState;
  const [isDrawing, setIsDrawing] = isDrawingState
  const [puzzles, setPuzzles] = puzzleState
  const [debug, setDebug] = debugState


  const uploadImage = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        if (typeof reader.result !== "string") {
          return reject("failed to load an image")
        }
        return resolve(reader.result)
      }
      reader.onerror = () => {
        return reject("failed to load an image")
      }
    })

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        return resolve(image)
      };
      image.onerror = () => {
        return reject(null)
      }
      image.crossOrigin = "anonymous";
      image.src = dataUrl;
    })

    setImages(state => [...state, { image, id: crypto.randomUUID() }])

  }

  const deleteImage = async (id: string) => {
    setImages(state => state.filter(img => img.id !== id))
  }

  const setImage = async (id: string) => {
    const image = images.find(img => img.id === id)

    if (!image) {
      return
    }
    setCurrentImage(image.image)
    startNewGame(image.image)
    //clear canvas
  }

  const startNewGame = (image: HTMLImageElement | null = currentImage) => {
    if (!image) {
      return
    }

    if (!canvasRef.current) {
      throw "Connect canvasRef to canvas";
    }

    //clear canvasRef
    currentCanvasState.current?.clearState()
    setPuzzles([])
    const ctx = canvasRef.current.getContext("2d");
    const _canvasState = new CanvasState(ctx!, image);
    currentCanvasState.current = _canvasState;

  }


  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!currentCanvasState.current) {
      return;
    }

    currentCanvasState.current.pushPointToState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
    setIsDrawing(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!currentCanvasState.current) {
      return;
    }
    currentCanvasState.current.pushPointToState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
    currentCanvasState.current.nextState();
    setPuzzles([...currentCanvasState.current.puzzles]);
    setIsDrawing(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    if (!currentCanvasState.current) {
      return;
    }
    currentCanvasState.current.pushPointToState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
  };

  const deletePuzzle = (index: number) => {
    if (!currentCanvasState.current) {
      return
    }
    currentCanvasState.current?.deleteStage(index);
    const puzzles = currentCanvasState.current.puzzles
    setPuzzles([...puzzles]);
  }

  return {
    canvasRef,
    currentCanvasState,
    images,
    uploadImage,
    deleteImage,
    setImage, currentImage,
    startNewGame,
    puzzles,
    isDrawing,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    deletePuzzle,
    debug
  };
};
