
import { Controller, Get, Post, Param, Req, Query } from '@nestjs/common';
import { TrainService } from './train.service';


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
    async getTrains(@Query('destination') destination:string){
        return this.trainService.findTrains(destination)
    }
}