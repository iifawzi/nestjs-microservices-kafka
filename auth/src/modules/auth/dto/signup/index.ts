import { IsEmail, IsNotEmpty, MinLength, Matches, MaxLength, IsString } from 'class-validator';
import { Match } from 'src/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SignupBody {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toString().toLowerCase())
    @ApiProperty({ example: "iifawzie@gmail.com" })
    public email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    // Must contain capital, small letters and at least a single number char. 
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    @IsNotEmpty()
    @ApiProperty({ example: "12Qwaszxerdfcv", description: 'Password must contain capital, small, and number chars and at least 6 chars' })
    public password: string;

    @Match('password', { message: '$property must match password exactly' })
    @IsNotEmpty()
    @ApiProperty({ example: "12Qwaszxerdfcv" })
    public passwordConfirmation: string;
}