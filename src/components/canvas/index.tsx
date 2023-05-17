import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePuzzleState } from "../../context/puzzle/hooks";

interface Props {
    onDraw: (
        context: CanvasRenderingContext2D,
        sx: number,
        sy: number,
        cx: number,
        cy: number
    ) => void;
    onStart: () => void;
    onStop: () => void;
    className?: string;
    onEnd: () => void;
}
interface Point {
    X: number;
    Y: number;
}
//not my code, took this code, because my first version of canvas wasn't responsive
export const Canvas: React.FC<Props> = ({
    onDraw,
    onStart,
    onStop,
    className,
    onEnd,
}) => {
    const [start, setStart] = useState<Point>({ X: 0, Y: 0 });

    const { canvasRef, canvasDimensions } = usePuzzleState();


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.height = canvasDimensions.height;
        canvas.width = canvasDimensions.width;
        canvas.style.height = "100%";
        canvas.style.width = "100%";
    }, [canvasDimensions.height, canvasDimensions.width]);

    const startDrawing =
        ({ nativeEvent }: any) => {
            let { offsetX, offsetY } = nativeEvent;
            const canvas = canvasRef.current;
            if (!canvas) return;
            if (window.TouchEvent) {
                if (nativeEvent.changedTouches?.length) {
                    offsetX = nativeEvent.changedTouches[0].clientX - canvas.offsetLeft;
                    offsetY = nativeEvent.changedTouches[0].clientY - canvas.offsetTop;
                }
            }
            const bound = canvas.getBoundingClientRect();
            const normalizeX = offsetX / bound.width;
            const normalizeY = offsetY / bound.height;
            setStart({ X: normalizeX, Y: normalizeY });
            onStart();
        }

    const finishDrawing = () => {
        onStop();
    }

    const canvasLeave = useCallback(() => {
        onEnd();
    }, [onEnd]);

    const draw = useCallback(
        ({ nativeEvent }: any) => {
            let { offsetX, offsetY } = nativeEvent;
            const canvas = canvasRef.current;
            if (!canvas) return;
            if (window.TouchEvent) {
                if (nativeEvent.changedTouches?.length) {
                    offsetX = nativeEvent.changedTouches[0].clientX - canvas.offsetLeft;
                    offsetY = nativeEvent.changedTouches[0].clientY - canvas.offsetTop;
                }
            }
            const bound = canvas.getBoundingClientRect();
            const normalizeX = offsetX / bound.width;
            const normalizeY = offsetY / bound.height;
            const context = canvas.getContext("2d");
            onDraw(context!, start!.X, start!.Y, normalizeX, normalizeY);
            setStart({ X: normalizeX, Y: normalizeY });
        },
        [canvasRef.current, onDraw, start]
    );

    return (
        <canvas
            ref={canvasRef}
            onMouseLeave={canvasLeave}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={finishDrawing}
            onTouchMove={draw}
            className={className}
        />
    );
};