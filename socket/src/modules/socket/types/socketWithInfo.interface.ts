import { Socket } from 'socket.io';
export default interface SocketWithInfo extends Socket {
    joinedRooms: string[]
    userId: number,
    fullName: string,

}