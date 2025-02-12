
import { Controller, Post, Body } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './booking.service';

@Controller('bookings')
export class   BookingsController {

    constructor(private readonly bookingsService:BookingsService){}

    @Post('book')
    async CreateBooking(@Body() createBookingDTo:CreateBookingDto){
        return  this.bookingsService.createBooking(createBookingDTo)
    }
}