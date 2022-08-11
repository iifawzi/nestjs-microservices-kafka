import { LoggerService } from "@nestjs/common";

export default class LoggerMock implements LoggerService {
    log(message: any, ...optionalParams: any[]) {
        return;
    }

    warn(message: any, ...optionalParams: any[]) {
        return;
    }

    error(message: any, ...optionalParams: any[]) {
        return;
    }

    verbose(message: any, ...optionalParams: any[]) {
        return;
    }

    debug(message: any, ...optionalParams: any[]) {
        return;
    }
    
}