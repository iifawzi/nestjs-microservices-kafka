"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const class_transformer_1 = require("class-transformer");
let DynamicResponseInterceptor = class DynamicResponseInterceptor {
    intercept(context, handler) {
        return handler.handle().pipe((0, operators_1.map)((handlerResponse) => {
            context.switchToHttp().getResponse().statusCode = handlerResponse.statusCode;
            if (Object.keys(handlerResponse.data).length !== 0 && handlerResponse.dataModel) {
                const convertedData = (0, class_transformer_1.plainToInstance)(handlerResponse.dataModel, handlerResponse.data, {
                    excludeExtraneousValues: true,
                });
                handlerResponse.data = convertedData;
            }
            delete handlerResponse.dataModel;
            return handlerResponse;
        }));
    }
};
DynamicResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], DynamicResponseInterceptor);
function UseDynamicResponse() {
    return (0, common_1.UseInterceptors)(new DynamicResponseInterceptor());
}
exports.default = UseDynamicResponse;
//# sourceMappingURL=dynamicResponse.interceptor.js.map