"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = require("helmet");
const securityMiddlewares = (app) => {
    app.use((0, helmet_1.default)());
};
exports.default = securityMiddlewares;
//# sourceMappingURL=securityMiddlewares.js.map