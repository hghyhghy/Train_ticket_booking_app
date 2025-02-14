
import { Controller, Post, Body, Query, BadRequestException, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService:PaymentService){}

    @Post('initiate')
    async initiatePayment(

        @Body('bookingId') bookingId:number,
        @Body('email') email:string,
        @Body('paymentMethod') paymentMethod:string
    ){

        if (!bookingId || !email || !paymentMethod) {
            throw new BadRequestException('Missing required fields');
        }

        return this.paymentService.initiatePayment(bookingId,email,paymentMethod)

    }

    @Get('verify')
    async verifyPayment(@Query('token') token:string){
        if (!token) {
            throw new BadRequestException('Token is required');
          }
        return this.paymentService.verifyPayment(token)
    }

    // code for checking status 
    @Get('status/:bookingId')
    async checkPaymentStatus(@Query('bookingId') bookingId:number){
        if (!bookingId) {
            throw new BadRequestException('Booking ID is required');
        }

        return this.paymentService.checkPaymentStatus(bookingId)
    }
}