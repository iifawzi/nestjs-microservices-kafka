import * as Joi from "joi";
import { AllowedEventsForEmit, eventInfo } from "../types";

export interface MessagePayload {
    roomName: string,
    message: string
}

const joinRoomEvent: eventInfo = {
    type: AllowedEventsForEmit.message,
    payloadSchema: Joi.object({
        roomName: Joi.string().required(),
        message: Joi.string().required(),
    })
}


export default joinRoomEvent;