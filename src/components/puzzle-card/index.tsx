import { PanInfo, motion } from "framer-motion";
import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import { cardFlyOut } from "../../animations";
import { Shape } from "../../canvas/shape";
import { isAlmostIntersected } from "../../utils/polyon-intersection";
import { complexPolygonToRectPolygon, domRectToPolygon, getPolygonBoundingBox } from "../../utils";

export interface PuzzleCardProps {
  initialX: number;
  initialY: number;

  initialWidth: number;
  initialHeight: number;

  image: string;
  deletePuzzle: () => void;

  shape: Shape;
  canvasRect: DOMRect;
}

const StyledCard = styled(motion.div)<{ width?: number; height?: number }>`
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.width}px !important;
  height: ${(props) => props.height}px !important;
  img {
    display: block;
    object-fit: contain;
    width: 100%;
    height: 100%;
    user-select: none;
  }
`;

const DraggableWrapper = motion.div;

export const PuzzleCard: FC<PuzzleCardProps> = (props) => {
  const [initialCoords, setInitialCoords] = useState<{ left: number; top: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const puzzleRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!cardRef.current) {
      throw "provide ref";
    }
    const { top, left } = cardRef.current.getBoundingClientRect();
    setInitialCoords({
      left: left,
      top: top,
    });
  }, []);
  const animation = useMemo(() => {
    if (!initialCoords) {
      return null;
    }
    return cardFlyOut({
      x: props.initialX - initialCoords.left,
      y: props.initialY - initialCoords.top,
      height: 250,
      width: 250,
      initialHeight: props.initialHeight,
      initialWidth: props.initialWidth,
    });
  }, [initialCoords]);

  const dragHandler = (info: PanInfo) => {
    if (!puzzleRef.current) {
      return;
    }
    setIsDragging(true);
  };

  const dragEndHandler = () => {
    if (!puzzleRef.current) {
      return;
    }
    setIsDragging(false);
    //?
    const relativeCanvasPolygon = props.shape.getRelativeToScreenShapePolygon(props.canvasRect);
    const puzzleRect = puzzleRef.current.getBoundingClientRect();
    console.log(complexPolygonToRectPolygon(relativeCanvasPolygon));
    console.log(domRectToPolygon(puzzleRect));
    const isPuzzleOnPlace = isAlmostIntersected(
      domRectToPolygon(puzzleRect),
      complexPolygonToRectPolygon(relativeCanvasPolygon)
    );
    if (isPuzzleOnPlace) {
      props.deletePuzzle();
    }

    // const relativeCanvasPolygon = props.shape.getRelativeToScreenShapePolygon(props.canvasRect);
    // const puzzleRect = puzzleRef.current.getBoundingClientRect();
    // console.log(domRectToPolygon(puzzleRect));
    // console.log(complexPolygonToRectPolygon(relativeCanvasPolygon));
    // console.log(isAlmostIntersected(domRectToPolygon(puzzleRect), complexPolygonToRectPolygon(relativeCanvasPolygon)));
  };

  return (
    <div ref={cardRef} style={{ zIndex: 1, height: 250, width: 250 }}>
      {animation && (
        <DraggableWrapper
          dragTransition={{ power: 0, bounceStiffness: 300, bounceDamping: 20 }}
          onDrag={(e, info) => dragHandler(info)}
          onDragEnd={dragEndHandler}
          drag={true}
          whileHover={isDragging ? undefined : { scale: 1.1 }}
        >
          <StyledCard
            ref={puzzleRef}
            width={isDragging ? props.initialWidth : undefined}
            height={isDragging ? props.initialHeight : undefined}
            //   onClick={() => props.onClick()}
            transition={{
              duration: 1.5,
            }}
            variants={animation}
            initial={"initial"}
            animate={"animate"}
          >
            <img draggable={false} src={props.image} alt="" />
          </StyledCard>
        </DraggableWrapper>
      )}
    </div>
  );
};
