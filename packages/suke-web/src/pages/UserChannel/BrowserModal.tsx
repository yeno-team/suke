import { Browser } from "../../components/Browser"
import { Modal } from "../../components/Modal"


export interface BrowserModalProps {
    active: boolean;
    setActive: (active: boolean) => void;
    className?: string;
}

export const BrowserModal = ({ active, className, setActive }: BrowserModalProps) => {
    return (
        <Modal active={active} className={className}>
            <Browser setActive={setActive}></Browser>
        </Modal>
    )
}