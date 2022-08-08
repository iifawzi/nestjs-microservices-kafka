"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestIdService = void 0;
class RequestIdService {
    constructor(request) {
        this.request = request;
    }
    getRequestId() {
        console.log(this.request);
        return this.request.id;
    }
}
exports.RequestIdService = RequestIdService;
//# sourceMappingURL=RequestId.js.map