import * as Joi from "joi";
import { AllowedEventsForEmit, eventInfo } from "../types";

export interface joinRoomPayload {
    name: string,
    userId: string
}

const joinRoomEvent: eventInfo = {
    type: AllowedEventsForEmit.join_room,
    payloadSchema: Joi.object({
        name: Joi.string().required(),
        userId: Joi.string().required(),
    })
}


export default joinRoomEvent;