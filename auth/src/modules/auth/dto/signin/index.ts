import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class SigninBody {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toString().toLowerCase())
    @ApiProperty({ example: "iifawzie@gmail.com" })
    public email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "12Qwaszxerdfcv", description: 'Password must contain capital, small, and number chars and at least 6 chars' })
    public password: string;
}

export class SigninResponse {
    @ApiProperty()
    @Expose()
    public userId: string

    @ApiProperty({example: 'Fawzi Abdulfattah'})
    @Expose()
    public fullName: string

    @ApiProperty({example: 'iifawzie@gmail.com'})
    @Expose()
    public email: string

    @ApiProperty({example: false})
    @Expose()
    public isVerified: boolean

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImZpcnN0TmFtZSI6IkZhd3ppIiwibGFzdE5hbWUiIoMnOa1GZhdHRhaCIsImVtYWlsIjoiZmF3emlAeGlvdC5jb20iLCJpc1Bhc3N3b3JkU2V0Ijp0cnVlLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwicGhvbmVWZXJpZmllZCI6ZmFsc2UsImlhdCI6MTYzMzMxNDI3OCwiZXhwIjoxNjMzNDAwNjc4fQ.gdpuUFso2nIK0u-23ci4bm5lgDgIgA7lkX8FK3-cbw4' })
    @Expose()
    public accessToken: string;
}