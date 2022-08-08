"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configureCors = (app) => {
    app.enableCors({
        origin: '*',
        allowedHeaders: 'Authorization, X-Requested-With, Content-Type, Accept, Observe',
        methods: 'GET,PUT,POST,DELETE,PATCH,UPDATE,OPTIONS',
        credentials: true,
    });
};
exports.default = configureCors;
//# sourceMappingURL=configureCors.js.map