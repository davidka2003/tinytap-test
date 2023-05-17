import { useContext, useState } from "react";
import { PuzzleContext } from "..";
import { CanvasState } from "../../../canvas/canvas-state";
import { IPoint } from "../../../types";

export const usePuzzleState = () => {
  const { canvasRef, currentCanvasState, currentImageState, imagesState, isDrawingState, puzzleState, debugState, canvasDimenionsState } = useContext(PuzzleContext);
  const [images, setImages] = imagesState;
  const [currentImage, setCurrentImage] = currentImageState;
  const [isDrawing, setIsDrawing] = isDrawingState
  const [puzzles, setPuzzles] = puzzleState
  const [debug, setDebug] = debugState
  const [canvasDimensions, setCanvasDimensions] = canvasDimenionsState

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
    const _canvasState = new CanvasState(ctx!, image, canvasDimensions);
    currentCanvasState.current = _canvasState;

  }


  const handleDraw = (sx: number, sy: number) => {

    if (!isDrawing) return;
    if (!currentCanvasState.current) {
      return;
    }
    currentCanvasState.current.pushPointToState({
      x: canvasDimensions.width * sx,
      y: canvasDimensions.height * sy,
    });
  };

  const handleStartDraw = () => {

    if (!canvasRef.current) {
      return
    }
    setIsDrawing(true)
  }

  const handleStopDraw = () => {
    if (!currentCanvasState.current) {
      return;
    }
    if (!canvasRef.current) {
      return
    }
    const currentBB = canvasRef.current.getBoundingClientRect()

    currentCanvasState.current.nextState({
      scaleX: currentBB.width / canvasDimensions.width,
      scaleY: currentBB.height / canvasDimensions.height
    });
    setPuzzles([...currentCanvasState.current.puzzles]);
    setIsDrawing(false);
  }

  const deletePuzzle = (index: number) => {
    if (!currentCanvasState.current) {
      return
    }
    currentCanvasState.current?.deleteStage(index);
    const puzzles = currentCanvasState.current.puzzles
    setPuzzles([...puzzles]);
  }

  const setCanvasHeight = (height: number) => {
    setCanvasDimensions(state => ({ ...state, height }))
  }
  const setCanvasWidth = (width: number) => {
    setCanvasDimensions(state => ({ ...state, width }))
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
    deletePuzzle,
    debug,
    setCanvasHeight,
    setCanvasWidth,
    canvasDimensions,
    handleStartDraw,
    handleStopDraw,
    handleDraw,
    scale: {
      scaleX: (canvasRef.current?.getBoundingClientRect().width ?? 0) / canvasDimensions.width,
      scaleY: (canvasRef.current?.getBoundingClientRect().height ?? 0) / canvasDimensions.height
    }
  };
};
