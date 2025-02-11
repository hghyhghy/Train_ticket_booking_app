import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(name: string, email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email, username: email, password: hashedPassword },
    });

    return { message: 'User registered successfully', user };
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return { message: 'Login successful', token };
  }
}
