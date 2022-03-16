import React from "react";
import useAuth from "@suke/suke-web/src/hooks/useAuth";
import { useScreenSize } from "@suke/suke-web/src/hooks/useScreenSize";
import { useTheaterRoom } from "@suke/suke-web/src/hooks/useTheaterRoom";
import classNames from "classnames";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "../../common/Navigation";
import { ChatBox } from "../../components/ChatBox";
import { VideoMenu } from "./VideoMenu";

export interface TheaterRoomPageProps {

}

type TheaterRoomPageParams = {
    roomId: string
}

export const TheaterRoomPage = () => {
    const { roomId } = useParams<TheaterRoomPageParams>()
    const { roomData, requestRoomData, joinTheaterRoom } = useTheaterRoom();
    const { user } = useAuth();
    const screen = useScreenSize();

    useEffect(() => {
        document.body.style.overflow='hidden';
        return () => {
            document.body.style.overflow='auto';
        }
    }, [])

    useEffect(() => {
        joinTheaterRoom(roomId as string);
        requestRoomData(roomId as string);
    }, [joinTheaterRoom, requestRoomData, roomId]);

    return (
        <div className="bg-spaceblack overflow-hidden flex flex-col lg:h-screen lg:block channel_elements lg:overflow-hidden lg:relative lg:mt-17 lg:mr-96">
            <Navigation className="lg:fixed z-10 lg:top-0"/>
            { 
                roomData?.live ?
                <VideoMenu roomData={roomData} className={classNames('md:max-h-full flex-grow', 'bg-darkblack')} isAuthenticated={user?.id !== 0} channelId={roomId!} playerHeight={screen.isTablet || screen.isMobile ? "280px" : "85.2%"} viewerCount={roomData.viewerCount} /> :
                <div className="w-full bg-coolblack h-72 lg:h-9/10 flex justify-center items-center text-white">{roomData != null && roomData.startedAt <= 0 ? 'The theater will start shortly! ' : 'This Schedule does not exist or has ended.'}</div>
            }

            <ChatBox channel="theater" className={"lg:mt-24px lg:fixed lg:right-0 lg:top-17 lg:h-94p lg:w-96 h-bigger"} identifier={roomId as string} height="6/20"  title={"Welcome the chat room! No Spoilers Please."} />
        </div>
    );
}