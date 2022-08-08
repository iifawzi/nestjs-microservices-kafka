"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const configsSchema = Joi.object({
    PORT: Joi.number(),
    API_GLOBAL_PREFIX: Joi.string().required(),
    SWAGGER_DOCS_PATH: Joi.string().required(),
});
exports.default = configsSchema;
//# sourceMappingURL=schema.js.map