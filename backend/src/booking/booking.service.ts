
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookingsService {

    constructor (private prisma:PrismaService){}

  // ✅ Get Ticket Details
  async getTicketDetails(bookingId: number) {
    console.log("Received bookingId:", bookingId); // Debugging

    if (!bookingId || isNaN(bookingId)) {
      throw new NotFoundException("Invalid booking ID");
    }

    const booking = await this.prisma.booking.findUnique({
      where: {
        id: Number(bookingId),
      },
      include: {
        train: true,
        passengers: true,
      },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    return {
      bookingId: booking.id, // ✅ Return bookingId
      train: booking.train,
      passengers: booking.passengers,
      bookedAt: booking.bookedAt,
      totalFare: booking.totalFare || booking.passengers.length * 600,
    };
  }
      
    

    async createBooking(dto:CreateBookingDto){

        const {userId,trainId,classId,passengers} = dto
        const farePerPassenger = 600; // Set this based on train class if needed
        const totalFare = passengers.length * farePerPassenger;
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