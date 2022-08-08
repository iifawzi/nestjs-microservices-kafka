import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

export const DescribeAPI = (description: string) => {
    return applyDecorators(ApiOperation({ description }));
};

export default DescribeAPI;