import { ChannelSettings } from "../../components/ChannelSettings";
import { Modal } from "../../components/Modal"

export interface ChannelSettingsModalProps {
    active: boolean;
    setActive: (active: boolean) => void;
    className?: string;
    roomId: string;
}

export const ChannelSettingsBrowserModal = ({ active, className, setActive, roomId }: ChannelSettingsModalProps) => {
    return (
        <Modal active={active} className={className}>
            <ChannelSettings active={active} roomId={roomId} setActive={setActive}></ChannelSettings>
        </Modal>
    )
}