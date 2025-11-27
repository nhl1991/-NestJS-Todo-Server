import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateTodoDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    content: string

    @IsBoolean()
    published: boolean

    @IsBoolean()
    public: boolean

}
