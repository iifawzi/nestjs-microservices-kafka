export default interface ChatsRepository {
    createChat(roomName: string): Promise<any>
    addMessage(roomName: string, message: string, userName: string, userId: string): Promise<any>
}