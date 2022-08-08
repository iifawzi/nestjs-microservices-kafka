import { ApiProperty } from "@nestjs/swagger";

export default class SuccessResponseDTO<TData> {

    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;

    @ApiProperty()
    data: TData;

    dataModel: any
}
