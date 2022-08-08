"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const setGlobalPipes = (app) => {
    return app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        errorHttpStatusCode: common_1.HttpStatus.BAD_REQUEST,
        whitelist: true,
        forbidNonWhitelisted: true
    }));
};
exports.default = setGlobalPipes;
//# sourceMappingURL=setGlobalPipes.js.map