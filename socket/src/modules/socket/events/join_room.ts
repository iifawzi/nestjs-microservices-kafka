import * as Joi from "joi";
import { AllowedEventsForEmit, eventInfo } from "../types";

export interface joinRequestPayload {
    type: string,
    id: number
}

const joinRoomEvent: eventInfo = {
    type: AllowedEventsForEmit.join_room,
    payloadSchema: Joi.object({
        name: Joi.string().required(),
        userId: Joi.number().required(),
    })
}


export default joinRoomEvent;