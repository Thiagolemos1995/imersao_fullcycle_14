import { Body, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { DirectionsService } from 'src/maps/directions/directions.service';
import { RouteSerializer } from './route.serializer';

@Injectable()
export class RoutesService {

  constructor(private prismaService: PrismaService, private directionsService: DirectionsService) { }

  async create(@Body() createRouteDto: CreateRouteDto) {
    const { available_travel_modes, geocoded_waypoints, routes, request } =
      await this.directionsService.getDirection(
        createRouteDto.source_id,
        createRouteDto.destination_id
      );

    const legs = routes[0].legs[0]

    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        source: {
          name: legs.start_address,
          location: {
            lat: legs.start_location.lat,
            lng: legs.start_location.lng
          }
        },
        destination: {
          name: legs.end_address,
          location: {
            lat: legs.end_location.lat,
            lng: legs.end_location.lng
          }
        },
        distance: legs.distance.value,
        duration: legs.distance.value,
        directions: JSON.stringify({
          available_travel_modes,
          geocoded_waypoints,
          routes,
          request,
        })
      }
    });
  }

  async findAll() {
    const routes = await this.prismaService.route.findMany();
    return routes.map(route => new RouteSerializer(route))
  }

  async findOne(id: string) {
    const route =  await this.prismaService.route.findUniqueOrThrow({
      where: { id },
    });

    return new RouteSerializer(route)
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
