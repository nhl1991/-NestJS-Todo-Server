import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(8,20)
    password: string;

    @IsString()
    @Length(6,12)
    username: string;
}


export class UpdateUserDto {
    

    @IsString()
    @Length(6,12)
    username: string;
}


export class UpdatePasswordDto {
    

    @IsString()
    @Length(8,20)
    password: string;
}


export class DeleteUserDto {
    @IsEmail()
    email: string;
}


export class ResponseUserDto {
    @IsEmail()
    email: string;

    @IsString()
    username: string;
}