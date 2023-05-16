import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import styled from "styled-components";
import { Puzzle } from "./canvas/puzzle";
import { CanvasState } from "./canvas/canvas-state";
import { PuzzleCard } from "./components";
import { ImageUploader } from "./components/image-uploader";
import { usePuzzleState } from "./context/puzzle/hooks";

const StyledApp = styled.div`
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  position: relative;
  overflow-x: hidden; 
  background-color:#F5F5F5;
`;

const StyledSideBar = styled.div`
  padding:12px;
  width: 300px;
  max-height:100%;
  overflow-y: auto;
  flex-shrink:0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-right: solid 1px #404040;
`;

const StyledMain = styled.main`
  flex: 1 1 0;
  top: 0;
  position: sticky;
  height:100%;
  display: flex;
  flex-direction:column;
  overflow-x: hidden;
  gap:16px;
`

const StyledCanvas = styled.canvas`
  /* top: 0;
  position: sticky; */
  /* flex: 1 1 0;
  height: 100%; */
`;
const StyledPlaceHolder = styled.div`
  min-height:600px;
  display:flex;
  justify-content:center;
  align-items:center;
  flex:1;
`

function App() {
  const { canvasRef, images, currentImage, deletePuzzle, currentCanvasState, puzzles, handleMouseDown, handleMouseMove, handleMouseUp } = usePuzzleState()

  return (
    <StyledApp>
      <StyledSideBar>
        <p>Your Puzzles</p>
        <>
          {puzzles.map(
            (puzzle, index) =>
              puzzle.image && (
                <PuzzleCard
                  canvasRect={canvasRef.current!.getBoundingClientRect()}
                  shape={puzzle}
                  initialHeight={puzzle.dimensions.height}
                  initialWidth={puzzle.dimensions.width}
                  deletePuzzle={() => {
                    deletePuzzle(index)
                  }}
                  image={puzzle.image}
                  key={puzzle.id}
                  initialX={puzzle.screenCoordinates.x}
                  initialY={puzzle.screenCoordinates.y}
                />
              )
          )}
        </>
      </StyledSideBar>
      <StyledMain>
        {images.length > 0 ? <StyledCanvas
          width={1280}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={canvasRef}
        ></StyledCanvas> : <StyledPlaceHolder>
          <h1>Upload and pick an image to start game</h1>
        </StyledPlaceHolder>}
        <ImageUploader />
      </StyledMain>
    </StyledApp>
  );
}

export default App;
