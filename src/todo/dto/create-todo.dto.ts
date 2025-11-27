import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreateTodoDto {
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
