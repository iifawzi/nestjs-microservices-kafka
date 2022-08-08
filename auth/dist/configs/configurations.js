"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    PORT: parseInt(process.env.PORT) || 3000,
    API_GLOBAL_PREFIX: process.env.API_GLOBAL_PREFIX,
    SWAGGER_DOCS_PATH: process.env.SWAGGER_DOCS_PATH,
});
//# sourceMappingURL=configurations.js.map