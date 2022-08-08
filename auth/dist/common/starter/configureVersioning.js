"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const configureVersioning = (app) => {
    app.enableVersioning({ type: common_1.VersioningType.URI });
};
exports.default = configureVersioning;
//# sourceMappingURL=configureVersioning.js.map