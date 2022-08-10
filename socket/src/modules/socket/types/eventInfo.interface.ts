import Joi from "joi";
import { AllowedEventsForEmit } from ".";

interface eventInfo {
    type: AllowedEventsForEmit
    payloadSchema: Joi.Schema
}

export default eventInfo