import { motion } from "framer-motion";
import { FC } from "react";
import { styled } from "styled-components";

export interface ButtonProps {
    onClick?: () => void
    className?: string
    children: React.ReactNode
}
const StyledButton = styled(motion.button)`
    all: unset;
    box-sizing:border-box;
    cursor: pointer;
    border-radius:50%;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:4px;
`
export const Button: FC<ButtonProps> = ({ onClick, className, children }) => {
    return <StyledButton whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }} className={className} onClick={onClick}>{children}</StyledButton>
}