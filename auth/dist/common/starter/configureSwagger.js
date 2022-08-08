"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const basicAuth = require("express-basic-auth");
const configureSwagger = (app) => {
    const configService = app.get(config_1.ConfigService);
    const swaggerDocsPath = configService.get('SWAGGER_DOCS_PATH');
    const options = new swagger_1.DocumentBuilder()
        .setTitle('LINKDEV - Microservices')
        .setDescription('API Documintation for Authentication service')
        .setVersion('1.0')
        .addBearerAuth({ in: 'header', type: 'http' })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    app.use(swaggerDocsPath, basicAuth({ challenge: true, users: { xiotapidocsadmin: 'xiotapiadmindocs' } }));
    swagger_1.SwaggerModule.setup(swaggerDocsPath, app, document);
};
exports.default = configureSwagger;
//# sourceMappingURL=configureSwagger.js.map