import { Emoji as EmojiType } from '@suke/suke-core/src/types/Emoji';
import { Emoji } from '@suke/suke-web/src/components/Emoji';
import classNames from 'classnames';

export interface EmoteCounterProps {
    counter: number,
    emote: EmojiType,
    className?: string,
    emoteSize?: number
}

export const EmoteCounter = ({counter, emote, className, emoteSize}: EmoteCounterProps) => {
    return (
        <div className={classNames("flex", className)}>
            <Emoji className="h-full wfull" emoji={emote} width={emoteSize || 29} />
            <span className="font-medium text-white font-sans h-full text-2xl ml-1 mt-5"><span className="text-xl font-medium mr-px">x</span>{counter}</span>
        </div>
    );
}