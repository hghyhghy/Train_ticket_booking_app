THIS IS A FULLSTACK TRAIN TICKET BOOKING APP WITH LOGIN/SIGNUP FUNCTIONALITY 
.USED TECHNOLOGIES ARE Next js  FOR FRONTEND , Nest js FOR BACKEND , MYSQL FOR DATABASE .... AND PRISMA ORM 
.PROJECT SETUP // SETUP FRONTEND 
TO START NEXT JS PROJECT RUN  


              npx create next-app@latest
              cd projectname 

TO RUN THE PROJECT 

              npm run dev

.PROJECT SETUP // SETUP BACKEND 
TO START NEST JS PROJECT RUN 

              $ npm i -g @nestjs/cli
              $ nest new project-name

Alternatives#
Alternatively, to install the TypeScript starter project with Git:

              $ git clone https://github.com/nestjs/typescript-starter.git project
              $ cd project
              $ npm install
              $ npm run start

NOW  FOR AUTHENTICATION U NEED TO INSTALL BYCRYPT AND JWT TOKEN 

              npm i bycrypt
              npm i jwt

TO COMMUNICATE WITH DATABASE WE NEED TO INSTALL PRISMA ORM 
Use the nest add command to automatically setup the library, Prisma and Docker (optionally):

              nest add nestjs-prisma
Manual Install

              # npm
              npm install nestjs-prisma
            
              # yarn
              yarn add nestjs-prisma

Furthermore, setup Prisma in your NestJS application, if you haven’t already.

              npm i -D prisma
              npm install @prisma/client
              
              npx prisma init

              npm install @prisma/cli --save-dev

Initialize Prisma:

              npx prisma init

NOTE I USE MYSQL U CAN USE ANY DATABASE AS YOUR CHOICE 
Edit the .env file: Configure your database connection in the .env file. For example, for a Mysql database:

              DATABASE_URL="mysql://user:password@localhost:3306/mydb?schema=public"

Define your data model: Edit prisma/schema.prisma to define your data model. For example:
                             
                            datasource db {
                             provider = "mysql"
                             url      = env("DATABASE_URL")
                           }
                        
                           generator client {
                             provider = "prisma-client-js"
                           }
                        
                           model User {
                             id    Int     @id @default(autoincrement())
                             name  String
                             email String  @unique
                           }
Generate the Prisma Client:

                npx prisma generate

Step 3: Install and Configure Prisma in NestJS
Install Prisma Client and Dependencies:

                   npm install @prisma/client
                   npm install @nestjs/config

Prisma Service:
Create src/prisma/prisma.service.ts:

       import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
       import { PrismaClient } from '@prisma/client';
    
       @Injectable()
       export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
         async onModuleInit() {
           await this.$connect();
         }

     async onModuleDestroy() {
       await this.$disconnect();
     }
       }

Prisma Module: Create src/prisma/prisma.module.ts:

         import { Module } from '@nestjs/common';
         import { PrismaService } from './prisma.service';
      
         @Module({
           providers: [PrismaService],
           exports: [PrismaService],
         })
         export class PrismaModule {}


Step 4: Create a User Module
Generate User Module, Controller, and Service:

         nest g module user
         nest g controller user
         nest g service user

Update User Service: Open src/user/user.service.ts and use Prisma to interact with the database:

     import { Injectable } from '@nestjs/common';
     import { PrismaService } from '../prisma/prisma.service';
  
     @Injectable()
     export class UserService {
       constructor(private prisma: PrismaService) {}

     async getUsers() {
       return this.prisma.user.findMany();
     }

     async getUser(id: number) {
       return this.prisma.user.findUnique({ where: { id } });
     }

     async createUser(name: string, email: string) {
       return this.prisma.user.create({ data: { name, email } });
     }

     async deleteUser(id: number) {
       return this.prisma.user.delete({ where: { id } });
     }
     }

Update User Controller: Open src/user/user.controller.ts and define the endpoints:

       import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
       import { UserService } from './user.service';
    
       @Controller('users')
       export class UserController {
         constructor(private userService: UserService) {}

     @Get()
     async getUsers() {
       return this.userService.getUsers();
     }

     @Get(':id')
     async getUser(@Param('id') id: number) {
       return this.userService.getUser(id);
     }

     @Post()
     async createUser(@Body('name') name: string, @Body('email') email: string) {
       return this.userService.createUser(name, email);
     }

     @Delete(':id')
     async deleteUser(@Param('id') id: number) {
       return this.userService.deleteUser(id);
     }
     }


Update User Module: Open src/user/user.module.ts and import the PrismaModule:
  
     import { Module } from '@nestjs/common';
     import { UserService } from './user.service';
     import { UserController } from './user.controller';
     import { PrismaModule } from '../prisma/prisma.module';
  
     @Module({
       imports: [PrismaModule],
       providers: [UserService],
       controllers: [UserController],
     })
     export class UserModule {}


Step 5: Integrate User Module into App Module
Update App Module: Open src/app.module.ts and import the UserModule and PrismaModule:

     import { Module } from '@nestjs/common';
     import { ConfigModule } from '@nestjs/config';
     import { UserModule } from './user/user.module';
     import { PrismaModule } from './prisma/prisma.module';
  
     @Module({
       imports: [
         ConfigModule.forRoot({ isGlobal: true }),
         UserModule,
         PrismaModule,
       ],
     })
     export class AppModule {}

Step 6: Run the Application
Start the NestJS Application:

     npm run start:dev


Step 7: Test the Application
Test Endpoints:
Use a tool like Postman or curl to test the RESTful API endpoints:

GET /users: Retrieve all users.
GET /users/:id: Retrieve a user by ID.
POST /users: Create a new user.

       {
         "name": "John Doe",
         "email": "john@example.com"
       }
DELETE /users/:id: Delete a user by ID.
