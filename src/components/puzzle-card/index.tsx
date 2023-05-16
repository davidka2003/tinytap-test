import { PanInfo, motion } from "framer-motion";
import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import { cardFlyOut } from "../../animations";
import { Puzzle } from "../../canvas/puzzle";
import { Polygon } from "../../utils";
import { IPoint } from "../../types";
import { usePuzzleState } from "../../context/puzzle/hooks";
import { Button } from "../button";
import { CheckIcon, Cross1Icon, Cross2Icon, IconJarLogoIcon, TrashIcon } from "@radix-ui/react-icons";
import { Modal } from "../modal";

export interface PuzzleCardProps {
  initialX: number;
  initialY: number;

  initialWidth: number;
  initialHeight: number;

  image: string;
  deletePuzzle: () => void;

  shape: Puzzle;
  canvasRect: DOMRect;
}

const StyledCard = styled(motion.div) <{ width?: number; height?: number }>`
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.width ?? 250}px !important;
  height: ${(props) => props.height ?? 250}px !important;
  img {
    display: block;
    object-fit: contain;
    width: 100%;
    height: 100%;
    user-select: none;
    object-position: left top;
  }
`;

const DraggableWrapper = styled(motion.div)`
  position:absolute;
  z-index:1;
`;

const DeleteButton = styled(Button)`
  position:absolute;
  top:0;
  right:0;
  left:auto;
  width:40px;
  height:40px;
  background: white;
`

const ModalWindow = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  .actions{
    display:flex;
    justify-content: center;
    gap:16px;
  }

`

export const PuzzleCard: FC<PuzzleCardProps> = (props) => {
  const { debug } = usePuzzleState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [currentCoords, setCurrentCoords] = useState<IPoint>({ x: 0, y: 0 })
  const [initialCoords, setInitialCoords] = useState<{ left: number; top: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const puzzleRef = useRef<HTMLImageElement>(null);
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

  const dragHandler = (e: MouseEvent, info: PanInfo) => {
    if (!puzzleRef.current) {
      return;
    }
    // debug && setCurrentCoords(Polygon.createFromDomRect(puzzleRef.current.getBoundingClientRect()).getCoordinates())
    setIsDragging(true);
  };

  const dragEndHandler = () => {
    if (!puzzleRef.current) {
      return;
    }
    const puzzleRect = puzzleRef.current.getBoundingClientRect();

    // debug && setCurrentCoords(Polygon.createFromDomRect(puzzleRect).getCoordinates())
    setIsDragging(false);
    if (props.shape.isInPlace(Polygon.createFromDomRect(puzzleRect), props.canvasRect)) {
      props.deletePuzzle();
    }
  };

  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <div ref={cardRef} style={{ height: 250, width: 250, flexShrink: 0 }}>
        {animation && (
          <DraggableWrapper
            dragTransition={{ power: 0, bounceStiffness: 300, bounceDamping: 20 }}
            onDrag={dragHandler}
            onDragEnd={dragEndHandler}
            drag={true}
            // whileHover={isDragging ? undefined : { scale: 1.1, transition: { duration: 0.3 } }}
            // transition={{
            //   duration: 1.5,
            // }}
            variants={animation}
            initial={"initial"}
            animate={"animate"}

          >
            {isDragging ? null : <DeleteButton onClick={openModal}>
              <TrashIcon width={30} height={30} />
            </DeleteButton>}
            <StyledCard
              ref={puzzleRef}
              width={isDragging ? props.initialWidth : undefined}
              height={isDragging ? props.initialHeight : undefined}
            // transition={{
            //   duration: 1.5,
            // }}
            // variants={animation}
            // initial={"initial"}
            // animate={"animate"}
            >
              <img style={debug ? { outline: "solid 1px red" } : {}} draggable={false} src={props.image} alt="" />
            </StyledCard>
          </DraggableWrapper>
        )}
      </div>
      <Modal onCloseModal={closeModal} open={isModalOpen}>
        {<ModalWindow>
          <h2>Are you sure you want to delete this piece</h2>
          <div className="actions">
            <Button onClick={props.deletePuzzle}>
              <CheckIcon width={40} height={40} />
            </Button>
            <Button onClick={closeModal}>
              <Cross2Icon width={40} height={40} />
            </Button>
          </div>
        </ModalWindow>}
      </Modal>
    </>
  );
};
