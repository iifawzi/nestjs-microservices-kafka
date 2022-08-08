"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const starter_1 = require("./common/starter");
const configureVersioning_1 = require("./common/starter/configureVersioning");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const PORT = configService.get('PORT');
    const GLOBAL_PREFIX = configService.get('API_GLOBAL_PREFIX');
    const bootstrapLogger = new common_1.Logger('Bootstrapping');
    (0, starter_1.securityMiddlewares)(app);
    app.setGlobalPrefix(GLOBAL_PREFIX);
    (0, configureVersioning_1.default)(app);
    (0, starter_1.configureCors)(app);
    (0, starter_1.setGlobalInterceptors)(app);
    (0, starter_1.setGlobalPipes)(app);
    (0, starter_1.configureSwagger)(app);
    await app.listen(PORT, '0.0.0.0');
    bootstrapLogger.verbose(`Application is up and running on http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map