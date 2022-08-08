import { ApiProperty } from "@nestjs/swagger";

export default class ErrorResponseDTO {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    error: any;
}