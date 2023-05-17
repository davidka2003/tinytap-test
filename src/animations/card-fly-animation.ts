import { Variants } from "framer-motion";

export const cardFlyOut = (intialPosition: {
  x: number;
  y: number;
  initialWidth: number;
  initialHeight: number;
  width: number;
  height: number;
}): Variants => {
  const { initialHeight, initialWidth, x, y, width, height } = { ...intialPosition }
  return {
    initial: {
      translateX: x,
      translateY: y,
      width: initialWidth,
      height: initialHeight,
      scale: 1.2,
      transition: {
        scale: {
          duration: 0.3
        }
      }
    },
    animate: {
      translateX: 0,
      translateY: 0,
      width: width,
      height: height,
      scale: 1,
      transition: {
        duration: 0.75
      }
    }
  };
};
