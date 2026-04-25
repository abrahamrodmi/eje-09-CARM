import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    email!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password!: string;
}