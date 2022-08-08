"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const uuid_1 = require("uuid");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, handler) {
        const id = (0, uuid_1.v4)();
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const { originalUrl, method } = request;
        this.logger.verbose(`THE ${id} REQUEST HAS STARTED [${method}] ${originalUrl ? originalUrl : ''}`);
        return handler.handle().pipe((0, rxjs_1.tap)(() => {
            const { statusCode } = context.switchToHttp().getResponse();
            const delay = Date.now() - now;
            this.logger.verbose(`THE ${id} REQUEST HAS ENDEED | ${statusCode} | [${method}] ${originalUrl ? originalUrl : ''} - ${delay}ms`);
        }), (0, rxjs_1.catchError)((error) => {
            const delay = Date.now() - now;
            this.logger.error(error.message, error.stack);
            this.logger.verbose(`THE ${id} REQUEST HAS ENDEED [${method}] ${originalUrl} - ${delay}ms`);
            return (0, rxjs_1.throwError)(() => new Error(error));
        }));
    }
};
LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_1.Logger])
], LoggingInterceptor);
exports.default = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map