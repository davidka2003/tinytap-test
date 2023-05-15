import { Variants } from "framer-motion";

export const cardFlyOut = (intialPosition: {
  x: number;
  y: number;
  initialWidth: number;
  initialHeight: number;
  width: number;
  height: number;
}): Variants => {
  return {
    initial: {
      translateX: intialPosition.x,
      translateY: intialPosition.y,
      width: intialPosition.initialWidth,
      height: intialPosition.initialHeight,
      scale: 1.2,
    },
    animate: {
      translateX: 0,
      translateY: 0,
      width: intialPosition.width,
      height: intialPosition.height,
      scale: 1,
    },
  };
};
