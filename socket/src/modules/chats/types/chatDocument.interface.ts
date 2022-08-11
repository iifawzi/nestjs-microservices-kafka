import { MessageLogI } from "./messageLog.interface";

export default interface ChatDocumentI {
    roomName: string,
    messages: MessageLogI[]
}