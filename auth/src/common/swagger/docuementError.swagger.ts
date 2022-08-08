import { ApiResponse } from "@nestjs/swagger";

export const DocuementErrorResponse = (statusCode: number, message: any, error: string) => {
    return ApiResponse({
        status: statusCode,
        schema: {
            title: `Error Response`,
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
                error: {
                    type: 'string',
                    example: error,
                }
            },
        },
    });
};

export default DocuementErrorResponse;