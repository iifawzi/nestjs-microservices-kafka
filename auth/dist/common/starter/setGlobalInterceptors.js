"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const interceptors_1 = require("../interceptors");
const setGlobalInterceptors = (app) => {
    return app.useGlobalInterceptors(new interceptors_1.LoggingInterceptor(new common_1.Logger('HTTP')));
};
exports.default = setGlobalInterceptors;
//# sourceMappingURL=setGlobalInterceptors.js.map