
import { Injectable } from '@nestjs/common';
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

    async findTrains(destination: string) {

        return this.prisma.train.findMany({
            where :{destination},
            include:{

                trainClasses:true
            }
        })
    }
    
}

