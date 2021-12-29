import React , { useEffect , useState } from "react";
import { GlobalEmote } from "@suke/suke-core/src/types/GlobalEmote";
import classNames from "classnames";

export interface ChatPanelProps {
    globalEmotes : GlobalEmote[]
}

export const ChatPanel = ({ globalEmotes } : ChatPanelProps ) : JSX.Element => {
    return (
        <div className={classNames(
            "bg-red",
            "absolute",
            "-top-20"
        )}>
            <h1> Hello World </h1>
        </div>
    )
} 