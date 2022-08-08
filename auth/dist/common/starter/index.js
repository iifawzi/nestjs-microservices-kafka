"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddlewares = exports.configureSwagger = exports.setGlobalInterceptors = exports.setGlobalPipes = exports.configureCors = void 0;
var configureCors_1 = require("./configureCors");
Object.defineProperty(exports, "configureCors", { enumerable: true, get: function () { return configureCors_1.default; } });
var setGlobalPipes_1 = require("./setGlobalPipes");
Object.defineProperty(exports, "setGlobalPipes", { enumerable: true, get: function () { return setGlobalPipes_1.default; } });
var setGlobalInterceptors_1 = require("./setGlobalInterceptors");
Object.defineProperty(exports, "setGlobalInterceptors", { enumerable: true, get: function () { return setGlobalInterceptors_1.default; } });
var configureSwagger_1 = require("./configureSwagger");
Object.defineProperty(exports, "configureSwagger", { enumerable: true, get: function () { return configureSwagger_1.default; } });
var securityMiddlewares_1 = require("./securityMiddlewares");
Object.defineProperty(exports, "securityMiddlewares", { enumerable: true, get: function () { return securityMiddlewares_1.default; } });
//# sourceMappingURL=index.js.map