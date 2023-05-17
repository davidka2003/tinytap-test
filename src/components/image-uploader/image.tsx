import { FC, useState } from "react"
import { styled } from "styled-components"
import { usePuzzleState } from "../../context/puzzle/hooks"
import { TrashIcon, PlayIcon } from "@radix-ui/react-icons"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../button"

const StyledImageContainer = styled(motion.div) <{ img: string }>`
    border-radius: 8px;
    border: solid 1px black;
    aspect-ratio: 4 / 3;
    height:100%;
    max-height:160px;
    background-image:url("${props => props.img}");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transition: scale 0.3s ease;
    overflow: hidden;
    flex-shrink:0;

    &:hover{
        scale:1.05;
    }
    .actions{
        background-color: #00000087;
        justify-content:center;
        align-items:center;
        gap:12px;
        width:100%;
        height:100%;
        display:flex;
        opacity:0;
        transition: opacity 0.3s ease;
        &:hover{
            opacity:1
        }
    }
`

export interface ImageProps {
    src: string
    id: string
}
export const Image: FC<ImageProps> = ({ src, id }) => {
    const { setImage, deleteImage } = usePuzzleState()

    return <StyledImageContainer initial={{ opacity: 1 }}
        exit={{ opacity: 0, width: 0, margin: 0 }} img={src}>
        <div className="actions">
            <Button onClick={() => setImage(id)}>
                <PlayIcon width={32} height={32} color={"white"} />
            </Button>
            <Button onClick={() => deleteImage(id)}><TrashIcon width={32} height={32} color={"white"} /></Button>
        </div>
    </StyledImageContainer>
}