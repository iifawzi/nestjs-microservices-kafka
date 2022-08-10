import joinRoomEvent from "./join_room";
import messageEvent from "./message";
import isTypingEvent from "./isTyping";

const EventsInfo = {
    [joinRoomEvent.type]: joinRoomEvent,
    [messageEvent.type]: messageEvent,
    [isTypingEvent.type]: isTypingEvent,
}

export default EventsInfo