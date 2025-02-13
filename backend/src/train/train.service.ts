
import { Injectable,NotFoundException } from '@nestjs/common';
import { Train } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TrainService{

    constructor(private prisma:PrismaService){}

    async getAllTrains(){

        return   this.prisma.train.findMany({

            include:{

                trainClasses:true
            }
        })

    }

    async bookTrain(userId:number,trainId:number){

        return { message: `User ${userId} booked train ${trainId}` };

    }

    async findTrains(destination: string,source:string) {

        return this.prisma.train.findMany({
            where :{destination,source},
            include:{

                trainClasses:true
            }
        })
    }

    async getTrainById(id:number):Promise<Train>{
          
          const train =  await this.prisma.train.findUnique({
            where:{id}
          })
          if (!train){
            throw new NotFoundException("No trins found")
          }

          return train

    }
    
}

