
import { Controller, Get, Post, Param, Req, Query ,ParseIntPipe} from '@nestjs/common';
import { TrainService } from './train.service';
import { Train } from '@prisma/client';


@Controller('trains')
export class TrainController{

    constructor(private trainService:TrainService){}

    @Get()
    async getAllTrains(){

        return this.trainService.getAllTrains()
    }

    @Post('book/:trainID')
    async bookTrain(@Param('trainId') trainId:number, @Req() req ){

        const userId= req.user.userId
        return this.trainService.bookTrain(userId,trainId)


    }
    // find root for searching trains
    @Get('find')
    async getTrains(@Query('destination' ) destination:string , @Query('source') source:string){
        return this.trainService.findTrains(destination,source)
    }

    // for filtering trains by id
    @Get(":id")
    async getTrainById(@Param('id',ParseIntPipe) id:number):Promise<Train>{
        return this.trainService.getTrainById(id)
    }

}