import { Socket } from 'socket.io';
export default interface SocketWithId extends Socket {
    userId: number,
}