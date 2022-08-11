import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from 'src/common/decorators';

export class VerifyBody {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "0f3c9678-54b4-4e22-a583-ae32ed2162a4" })
    public token: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "12Qwaszxerdfcv",})
    public password: string;

    @Match('password', { message: '$property must match password exactly' })
    @IsNotEmpty()
    @ApiProperty({ example: "12Qwaszxerdfcv" })
    public passwordConfirmation: string;
}