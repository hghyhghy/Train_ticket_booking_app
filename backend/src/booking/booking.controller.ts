
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './booking.service';

@Controller('bookings')
export class   BookingsController {

    constructor(private readonly bookingsService:BookingsService){}

    @Post('book')
    async CreateBooking(@Body() createBookingDTo:CreateBookingDto){
        return  this.bookingsService.createBooking(createBookingDTo)
    }

    @Get(':bookingId')
    async getTicket(@Param('bookingId') bookingId: string) {
      console.log("Booking ID from route:", bookingId); // ✅ Debugging
    
      return this.bookingsService.getTicketDetails(Number(bookingId)); // ✅ Convert to number
    }
}