import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    surname: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    mail: string;
}