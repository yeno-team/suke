import { parseFetchResponse } from "../parseFetchResponse"

export const getChannel = async (username: string) => {
    return parseFetchResponse(await fetch('/api/channels/' + username));
}

export const followChannel = async (channelName: string) => {
    return parseFetchResponse(await fetch('/api/channels/' + channelName + "/follow", {method: 'POST'}));
}

export const unfollowChannel = async (channelName: string) => {
    return parseFetchResponse(await fetch('/api/channels/' + channelName + "/unfollow", {method: 'POST'}));
}