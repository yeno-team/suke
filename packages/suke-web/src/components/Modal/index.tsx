import classNames from "classnames"
import { useEffect } from "react";
import { useChanged } from "../../hooks/useChanged";

export interface ModalProps {
    active: boolean,
    onClose?: () => void,
    onOpen?: () => void,
    children?: React.ReactNode,
    className?: string;
}

export const Modal = ({ active, onClose, onOpen, children, className }: ModalProps) => {
    const [activeChanged, prevActiveVal] = useChanged(active);

    useEffect(() => {
        if (activeChanged) {
            if (prevActiveVal === false && onOpen)
                onOpen();
            
            if (prevActiveVal === true && onClose)
                onClose();
        }
    }, [active, activeChanged, prevActiveVal, onOpen, onClose])

    return (
        <div className={classNames(active ? 'block' : 'hidden', className)}>
            {
                children
            }
        </div>
    )
}
