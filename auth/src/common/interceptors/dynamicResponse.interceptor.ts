import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { SuccessResponseDTO } from 'src/common/dto';

/*********************************************
1- Normally entities goes into the interceptor and nestjs turns it into the JSON. But we we will turn it to the given
DTO class instead which will have all the serialization rules (what fields to be exposed, and other types rules)
2- If there's an API that could respond with different success codes at different situations, this would be too hard to manage with the normal 
nest flow (by using HttpStatus). Using this interceptor, it will take the rsponse code from the handler's response.
***********************************************/

@Injectable()
class DynamicResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((handlerResponse: SuccessResponseDTO<any>) => {
        context.switchToHttp().getResponse().statusCode = handlerResponse.statusCode;

        if (Object.keys(handlerResponse.data).length !== 0 && handlerResponse.dataModel) {
          const convertedData = plainToInstance(handlerResponse.dataModel, handlerResponse.data, {
            excludeExtraneousValues: true,
          });
          handlerResponse.data = convertedData;
        }

        delete handlerResponse.dataModel;
        return handlerResponse;
      }),
    );
  }
}

export default function UseDynamicResponse() {
  return UseInterceptors(new DynamicResponseInterceptor());
}
