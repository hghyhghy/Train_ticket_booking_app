
import { IsInt, IsString, IsEmail, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';


class PassengerDto{

    @IsString()
    name:string

    @IsString()
    gender:string

    @IsInt()
    age:number

    @IsString()
    coachPosition:string

    @IsString()
    coachType:string

    @IsString()
    Food:string

    @IsString()
    Nationality:string

    @IsString()
    Phonenumber:string

}

export class CreateBookingDto{

    @IsInt()
    userId:number

    @IsInt()
    trainId:number

    @IsInt()
    classId:number

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PassengerDto)
    passengers: PassengerDto[];
  
    @IsInt()
    totalFare: number;
}