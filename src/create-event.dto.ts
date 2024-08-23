import { IsString, Length, isDateString } from "class-validator";

export class CreateEventDto {
    @IsString()
    @Length(5, 255, { message: "The name length is less than 5" })
    name: string;
    @Length(5, 255)
    description: string;
    //@isDateString()
    when: string;
    @Length(5, 255)
    address: string;
}