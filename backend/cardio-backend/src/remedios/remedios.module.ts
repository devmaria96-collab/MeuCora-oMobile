import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Remedio, RemedioSchema } from '../schemas/remedio.schema';
import { RemediosController } from './remedios.controller';
import { RemediosService } from './remedios.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Remedio.name, schema: RemedioSchema }])],
  controllers: [RemediosController],
  providers: [RemediosService],
  exports: [RemediosService],
})
export class RemediosModule {}
