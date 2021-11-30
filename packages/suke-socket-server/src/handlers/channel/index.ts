import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { User } from "@suke/suke-core/src/entities/User";
import { UserId } from "@suke/suke-core/src/entities/UserId";
import { ChannelManager } from "../../extensions/ChannelManager";
import { SocketServer, WebSocketConnection } from "../../server";
import { Handler } from "../Handler";
import { getRepository } from "typeorm";
import { UserChannelModel } from "@suke/suke-core/src/entities/UserChannel/UserChannel";


export const createChannelHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', (message: SocketMessage, ws: WebSocketConnection, user?: User) => {
        const msg = message as SocketMessageInput; // For type-safe data type
        const channelManager = new ChannelManager(server);

        // some how get the channel repository
        const channelRepo = getRepository(UserChannelModel)
        const users = server.getUserConnections();

        if (user.Id().Equals(new UserId(0))) {
            return server.emit('clientError', new Error("You do not have permission to edit the room settings."), ws)
        }

        

        switch(msg.type) {
            case 'ROOM_UPDATE':
                
                break;
        }
    }) 
}