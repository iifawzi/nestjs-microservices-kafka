import { MessageLogI } from "../types"

export default interface ChatsRepository {
    createChat(roomName: string): Promise<any>
    addMessage(roomName: string, messageInfo: MessageLogI) : Promise<any>
    getRoomInfo(roomName: string): Promise<any>
}