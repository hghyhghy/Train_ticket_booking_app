import {  Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService{
       
    private transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",  // Explicitly set host
        port: 465,  // Use 465 for SSL or 587 for TLS
        secure: true,

        auth:{user:"sarkarsubham624@gmail.com",pass:"nuup tbka prpz ihxl"}
    });

    async sendVerificationEmail(to:string,link:string){
        return this.transporter.sendMail({

            from: '"Train Booking System" <sarkarsubham624@gmail.com>',
            to,
            subject:"Confirm your payment",
            text:`Click the link to confirm your payment: ${link}`,
        })
    }

}