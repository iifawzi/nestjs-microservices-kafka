import joinRoomEvent from "./join_room";
import messageEvent from "./message";
import isTypingEvent from "./isTyping";
import healthCheckEvent from "./healthcheck";

const EventsInfo = {
    [joinRoomEvent.type]: joinRoomEvent,
    [messageEvent.type]: messageEvent,
    [isTypingEvent.type]: isTypingEvent,
    [healthCheckEvent.type]: healthCheckEvent
}

export default EventsInfo