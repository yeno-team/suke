import { useEffect } from "react";
import { Browser } from "../../components/Browser"
import { Modal } from "../../components/Modal"
import { useChannel } from "../../hooks/useChannel";


export interface BrowserModalProps {
    active: boolean;
    setActive: (active: boolean) => void;
    className?: string;
    roomId: string;
}

export const BrowserModal = ({ active, className, setActive, roomId }: BrowserModalProps) => {
    const { requests, getRequests } = useChannel();

    useEffect(() => {
        getRequests(roomId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal active={active} className={className}>
            <Browser active={active} roomId={roomId} requests={requests} setActive={setActive}></Browser>
        </Modal>
    )
}