import { Controller, Get, Query } from '@nestjs/common';
import { DirectionsService } from './directions.service';

@Controller('directions')
export class DirectionsController {

    constructor(private directionsService: DirectionsService) { }

    @Get()
    getDirection(
        @Query('originId') originId: string,
        @Query('destinationId') destinationId: string,
    ) {
        return this.directionsService.getDirection(originId, destinationId)
    }
}
