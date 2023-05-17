import React from "react";
import "./App.css";
import styled from "styled-components";
import { PuzzleCard } from "./components";
import { ImageUploader } from "./components/image-uploader";
import { usePuzzleState } from "./context/puzzle/hooks";
import { Canvas } from "./components/canvas";

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
  /* top: 0;
  position: sticky; */
  height:100%;
  display: flex;
  flex-direction:column;
  overflow-x: hidden;
  gap:16px;
  &>*{
    flex-shrink:1;
    flex-grow:0;
  }
`


const StyledPlaceHolder = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex:1 1 0;
`

function App() {
  const { canvasRef, images, handleStartDraw, handleStopDraw, deletePuzzle, handleDraw, puzzles, scale } = usePuzzleState()

  return (
    <StyledApp>
      <StyledSideBar>
        <p>Your Puzzles</p>
        {puzzles.map(
          (puzzle, index) => (
            puzzle.image ? <PuzzleCard
              canvasRect={canvasRef.current!.getBoundingClientRect()}
              puzzle={puzzle}
              initialHeight={puzzle.dimensions.height * scale.scaleY/* e.g scaleX */}
              initialWidth={puzzle.dimensions.width * scale.scaleX /* e.g scaleY */}
              deletePuzzle={() => {
                deletePuzzle(index)
              }}
              image={puzzle.image}
              key={puzzle.id}
              initialX={puzzle.screenCoordinates.x}
              initialY={puzzle.screenCoordinates.y}
            /> : null
          )
        )}
      </StyledSideBar>
      <StyledMain>
        {images.length > 0 ?
          <Canvas onDraw={(_, sx, sy) => {
            handleDraw(sx, sy)
          }} onEnd={console.log} onStart={handleStartDraw} onStop={handleStopDraw} />
          :
          <StyledPlaceHolder>
            <h1>Upload and pick an image to start game</h1>
          </StyledPlaceHolder>}
        <ImageUploader />
      </StyledMain>
    </StyledApp>
  );
}

export default App;
