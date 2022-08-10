import * as Joi from "joi";
import { AllowedEventsForEmit, eventInfo } from "../types";

export interface isTypingPayload {
    roomName: string,
}

const isTypingEvent: eventInfo = {
    type: AllowedEventsForEmit.isTyping,
    payloadSchema: Joi.object({
        roomName: Joi.string().required(),
    })
}


export default isTypingEvent;