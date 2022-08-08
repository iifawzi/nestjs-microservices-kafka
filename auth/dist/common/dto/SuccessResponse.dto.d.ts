export default class SuccessResponseDTO<TData> {
    statusCode: number;
    message: string;
    data: TData;
    dataModel: any;
}
