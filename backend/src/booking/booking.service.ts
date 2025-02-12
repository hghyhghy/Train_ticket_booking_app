
import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookingsService {

    constructor (private prisma:PrismaService){}

    async createBooking(dto:CreateBookingDto){

        const {userId,trainId,classId,passengers,totalFare} = dto
        const booking  = await this.prisma.booking.create({

            data:{

                userId:Number(userId),
                trainId:Number(trainId),
                classId:Number(classId),
                // totalFare:totalFare,

                passengers: {
                    create: passengers.map((passenger) => ({
                      name: passenger.name,
                      gender: passenger.gender,
                      age:Number(passenger.age),
                      email: passenger.email,
                      phone: passenger.phone,
                    })),
                  },
            },

            include:{

                passengers:true
            }
        })

        return {

            trainId,
            passengers:booking.passengers,
            totalFare
        }
    }
}