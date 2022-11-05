import * as Joi from "joi";
import { AllowedEventsForEmit, eventInfo } from "../types";

const healthCheckEvent: eventInfo = {
    type: AllowedEventsForEmit.healthCheck,
    payloadSchema: Joi.object().empty()
}


export default healthCheckEvent;