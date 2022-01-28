import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useCategory } from "../../hooks/useCategory";
import { useChannel } from "../../hooks/useChannel"
import { Button } from "../Button"
import { Checkbox } from "../Checkbox";

export interface ChannelSettingsProps {
    setActive: (active: boolean) => void;
    active: boolean;
    roomId: string;
}

export const ChannelSettings = ({setActive, active, roomId}: ChannelSettingsProps) => {
    const { channelData, updateRealtimeChannelData } = useChannel();
    const [title, setTitle] = useState(channelData.title || "");
    const [category, setCategory] = useState(channelData.category || "");
    const [privateRoom, setPrivateRoom] = useState(channelData.private || false);
    const [privatePassword, setPrivatePassword] = useState(channelData.password || "");
    const [followerOnlyChat, setFollowerOnlyChat] = useState(channelData.followerOnlyChat || false);
    const [changedPassword, setChangedPassword] = useState(false);
    const { categories } = useCategory();
    
    const changedSetting = changedPassword || channelData.title !== title || channelData.category !== category || channelData.private !== privateRoom || channelData.followerOnlyChat !== followerOnlyChat;

    useEffect(() => {
        if (changedSetting) return;
        setTitle(channelData.title);
        setCategory(channelData.category);
        setPrivateRoom(channelData.private);
        setPrivatePassword(channelData.password);
        setFollowerOnlyChat(channelData.followerOnlyChat);
    }, [changedSetting, channelData])

    const customStyles = {
        option: (provided: any, state: { isSelected: any; }) => ({
            ...provided,
            borderBottom: '1px dotted pink',
            color: state.isSelected ? 'black' : 'black',
            padding: 20
        }),
        control: (provided: any) => ({
            ...provided,
            padding: 4
        })
    }

    const handleSubmit = () => {
        const updatedChannelData = {
            ...channelData,
            title,
            category,
            private: privateRoom,
            password: privatePassword,
            followerOnlyChat: followerOnlyChat,
            channelId: roomId
        };

        updateRealtimeChannelData(updatedChannelData);
        setChangedPassword(false);
    }

    
    return (
        <div className="w-full h-screen top-0 z-30 fixed text-white font-sans bg-spaceblack lg:w-reallybig lg:h-big lg:left-1/2 lg:top-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-xl">
            <Button fontWeight="semibold" backgroundColor="red" onClick={() => setActive(false)} className="w-full py-4 lg:hidden">
                Close Settings
            </Button>
            <button className="hidden absolute right-0 mr-4 mt-2 md:block">
                <Icon icon="bi:x" onClick={() => setActive(false)} className={classNames('text-white m-1 text-3xl hidden lg:block')} />
            </button>
            <h1 className="ml-4 text-2xl font-bold mt-6">CHANNEL SETTINGS</h1>
            <form className="font-sans flex flex-col mt-2" autoComplete="off" onSubmit={(e) => {e.preventDefault();handleSubmit()}}>
                <label htmlFor="csettings_title" className='block text-sm mb-1 text-gray p-4'>
                    <h3 className="font-bold text-base mb-1">CHANNEL TITLE</h3>
                    <p>Set a channel title that describes your channels current activities!</p>
                </label>
                <input type="text" autoComplete="off" name="csettings_title" id="csettings_title" className="p-3 ml-4 bg-coolblack block border-darkgray border-solid border rounded-lg text-sm w-11/12" value={title} onChange={(e) => setTitle(e.currentTarget.value)} placeholder="Cool Channel Title..."></input>
                <label htmlFor="csettings_category" className='block text-sm mb-1 text-gray p-4 mt-6'>
                    <h3 className="font-bold text-base mb-1">CATEGORY</h3>
                    <p>Choose a Category fitting of the current media playing.</p>
                </label>
                <Select styles={customStyles} options={categories} className="w-11/12 ml-4" value={categories.find(v => v.value === category)} onChange={(e) => setCategory(e!.value)} ></Select>
                <label className='block text-sm mb-1 text-gray p-4 mt-6'>
                    <h3 className="font-bold text-base mb-1">SECURITY SETTINGS</h3>
                    <p>Options that control access to your channel</p>
                </label>
                <div className="px-4 text-sm font-sans flex ">
                    <label className="font-semibold mr-auto">
                        Private Channel Mode
                    </label>
                    <Checkbox active={privateRoom} onClick={() => setPrivateRoom(!privateRoom)}></Checkbox>
                </div>
                {
                    privateRoom && 
                    <div className="block mb-3">
                        <label className='block text-sm text-gray p-4 py-2 mt-2'>
                            <h3 className="font-bold text-sm mt-0">Private Password</h3>
                            <p>An optional setting which requires a password to access your channel.</p>
                        </label>
                        <input type="password" autoComplete="new-password" name="csettings_password" id="csettings_password" className="p-3 ml-4 bg-coolblack block border-darkgray border-solid border rounded-lg text-sm w-11/12" value={privatePassword} onChange={(e) => {setPrivatePassword(e.currentTarget.value); setChangedPassword(channelData.password.length !== privatePassword.length || true);}} placeholder="A private password for your channel..."></input>
                    </div>
                }
                <div className="px-4 text-sm font-sans flex mt-3">
                    <label className="font-semibold mr-auto">
                        Followers Only Chat
                    </label>
                    <Checkbox active={followerOnlyChat} onClick={() => setFollowerOnlyChat(!followerOnlyChat)}></Checkbox>
                </div>
                {
                    changedSetting && <Button className="w-95p mx-auto mt-12 font-semibold rounded" size={4} backgroundColor="blue">
                        Save Changes
                    </Button>
                }
            </form>
        </div>
    )
}