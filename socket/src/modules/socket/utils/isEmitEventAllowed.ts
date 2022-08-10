import Joi from "joi";
import EventsInfo from "../events";
import { AllowedEventsForEmit, eventInfo } from "../types";

export type isEmitEventAllowedType = { status: boolean, reason?: string }

const isEmitEventAllowed = (event: [string, any]): isEmitEventAllowedType => {
    const eventName = event[0];
    const eventPayload = event[1];

    /**** Checking whether the event is allowed or not ****/
    const isAllowedPrefix = AllowedEventsForEmit[eventName];
    if (!isAllowedPrefix) {
        return {
            status: false,
            reason: `Unknown event: ${JSON.stringify({ eventName, eventPayload })}`
        }
    }

    /**** Checking whether the payload is valid or not ****/
    const eventInfo: eventInfo = EventsInfo[eventName];
    const { error }: { error: Joi.ValidationError } = eventInfo.payloadSchema.validate(eventPayload);
    if (error) {
        return {
            status: false,
            reason: `Payload of event ${eventName} is invalid: ${JSON.stringify(error.details)}`
        }
    }

    return {
        status: true
    }
}

export default isEmitEventAllowed;