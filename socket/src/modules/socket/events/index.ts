import joinRoomEvent from "./join_room";
import messageEvent from "./message";


const EventsInfo = {
    [joinRoomEvent.type]: joinRoomEvent,
    [messageEvent.type]: messageEvent,
}

export default EventsInfo