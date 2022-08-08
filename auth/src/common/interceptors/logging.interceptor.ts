/**
 ************************************************************************************ 
 This  interceptor is used to log some details about the request and the response: 
 ************************************************************************************
 */

import { NestInterceptor, ExecutionContext, CallHandler, Injectable, Logger } from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export default class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: Logger) { }
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {

        const id = uuidv4()
        const now = Date.now();

        const request = context.switchToHttp().getRequest();
        const { originalUrl, method } = request;

        this.logger.verbose(`THE ${id} REQUEST HAS STARTED [${method}] ${originalUrl ? originalUrl : ''}`);
        return handler.handle().pipe(
            tap(() => {
                const { statusCode } = context.switchToHttp().getResponse();
                const delay = Date.now() - now;
                this.logger.verbose(`THE ${id} REQUEST HAS ENDEED | ${statusCode} | [${method}] ${originalUrl ? originalUrl : ''} - ${delay}ms`);
            }),

            catchError((error) => {
                const delay = Date.now() - now;
                this.logger.error(error.message, error.stack);
                this.logger.verbose(`THE ${id} REQUEST HAS ENDEED [${method}] ${originalUrl} - ${delay}ms`);
                return throwError(() => new Error(error));
            }),
        );
    }
}