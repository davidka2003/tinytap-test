import { FC } from "react";
import { styled } from "styled-components";

export interface PuzzleBoardProps {}

const StyledPuzzleBoard = styled.div``;
export const PuzzleBoard: FC<PuzzleBoardProps> = () => {
  return <StyledPuzzleBoard></StyledPuzzleBoard>;
};
