import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { EmptyResponseDTO } from "src/common/dto";

// This Decorator is used to specify the API response code, and the response for swagger documintation
export const DocuementSuccessResponse = <TModel extends Type<any>>(statusCode: number, message: string, model: TModel | any = EmptyResponseDTO) => {
    return applyDecorators(
        // Since the model is not referenced as Body at any controller, swagger need to know that it exists: 
        ApiExtraModels(model),
  
        ApiResponse({
            status: statusCode,
            schema: {
                title: `Success Response`,
                properties:
                {
                    statusCode: {
                        type: 'number',
                        example: statusCode,
                    },
                    message: {
                        type: 'string',
                        example: message,
                    },
                    data: model,
                },
            },
        }),
    );
};

export default DocuementSuccessResponse;