import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/common/email.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async initiatePayment(bookingId: number, email: string, paymentMethod: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    const verificationToken = uuidv4();
    const verificationLink = `https://your-domain.com/verify-payment?token=${verificationToken}`;

    await this.prisma.payment.create({
      data: {
        bookingId: Number(bookingId),
        email,
        paymentMethod,
        verificationToken,
      },
    });

    await this.emailService.sendVerificationEmail(email, verificationLink);

    return { message: 'Payment initiated. Please check your email for verification.' };
  }

  async verifyPayment(token: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { verificationToken: token },
      include: { booking: true }, // ✅ Ensure booking details are included
    });

    if (!payment) {
      throw new NotFoundException('Invalid or expired token');
    }

    if (payment.status === 'COMPLETED') {
      throw new BadRequestException('Payment already verified');
    }

    if (!payment.booking?.id) {
      throw new BadRequestException('Booking not associated with this payment.');
    }

    // ✅ Use a Prisma transaction to ensure atomic updates
    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      }),
      this.prisma.booking.update({
        where: { id: payment.booking.id }, // ✅ Ensure booking ID exists
        data: { paymentVerified: true },
      }),
    ]);

    return { message: 'Payment verified successfully. You can now download your ticket.' };
  }

  async checkPaymentStatus(bookingId: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { bookingId: Number(bookingId) },
      select: { status: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found.');
    }

    return { isPaid: payment.status === 'COMPLETED' };
  }
}
