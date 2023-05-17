import { ChangeEvent, FC } from "react";
import { styled } from "styled-components";
import { usePuzzleState } from "../../context/puzzle/hooks";
import { Image } from "./image";
import { AnimatePresence, motion } from "framer-motion";
import { UploadIcon } from "@radix-ui/react-icons";
import { Button } from "../button";

export interface ImageUploaderProps { }

const StyledImageUploader = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  /* gap: 16px; */
  overflow-x: auto;
  min-height: 150px;
  flex-grow:1;
  flex-shrink:0;
  &>*{
    /* instead of gap, for better animation */
    margin:  0 8px;
  }
  input{
    flex-shrink: 0;
  }
`;

const UploadFileInput = styled(Button)`
  flex-shrink:0;
  border-radius:0;
  width:40px;
  height: 40px;
  position: relative;
  cursor: pointer;
  svg{
    width:100%;
    height:100%;
  }
  label{
    width:100%;
    height:100%; 
    cursor: pointer;
  }
  input{
    display:none;
  }

`


export const ImageUploader: FC<ImageUploaderProps> = () => {
  const { images, uploadImage } = usePuzzleState()

  const fileUploadHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const images = event.target.files
    if (!images) {
      return
    }
    for (const image of images) {
      await uploadImage(image)
    }
  }

  return <StyledImageUploader>
    <AnimatePresence>

      {images.map(image => <Image key={image.id} id={image.id} src={image.image.src} />)}
    </AnimatePresence>
    <UploadFileInput >
      <label htmlFor="upload">
        <UploadIcon />
      </label>
      <input id={"upload"} multiple type="file" accept={"image/*"} onChange={fileUploadHandler} />
    </UploadFileInput>
  </StyledImageUploader>

};
