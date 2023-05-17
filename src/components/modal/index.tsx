import { FC, ReactNode, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { styled } from 'styled-components';
import { Button } from '../button';

export interface ModalProps {
    children?: ReactNode;
    onCloseModal?: () => void
    defaultOpen?: boolean
    open?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const ContentWraper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  padding: 48px 0;
`;

const DialogContent = styled(Dialog.Content)`
  background-color: #FAFAFA;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 500px;
  max-height: 85vh;
  padding: 16px 16px;
  &:focus {
    outline: none;
  }
`;

const DialogOverlay = styled(Dialog.Overlay)`
  background-color: #0000002f;
  position: fixed;
  inset: 0;
`;

const CloseButton = styled(Button)`
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  position: absolute;
  inset: 0;
  left: auto;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  &>svg {
    width:100%;
    height:100%;
    color: #000;
  }
`;
export const Modal: FC<ModalProps> = ({
    children,
    open: controlledOpen = false,
    className,
    style,
    defaultOpen,
    onCloseModal,
}) => {
    const isControlled = typeof controlledOpen !== "undefined"
    const hasDefaultValue = typeof defaultOpen !== "undefined"
    const [internalOpen, setInternalOpen] = useState(hasDefaultValue ? defaultOpen : false);

    const open = isControlled ? controlledOpen : internalOpen

    const onClose = () => {
        if (onCloseModal) {
            return void onCloseModal()
        }
        if (!isControlled) {
            return setInternalOpen(false)
        }
    }

    return (
        <Dialog.Root open={open}>
            <Dialog.Portal>
                <DialogOverlay />
                <DialogContent className={className} style={style}>
                    <ContentWraper>
                        {children}
                        <Dialog.Close asChild>
                            <CloseButton onClick={onClose}>
                                <Cross2Icon />
                            </CloseButton>
                        </Dialog.Close>
                    </ContentWraper>
                </DialogContent>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
