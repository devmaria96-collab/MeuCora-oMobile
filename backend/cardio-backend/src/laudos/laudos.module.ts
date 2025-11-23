import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Laudo, LaudoSchema } from '../schemas/laudo.schema';
import { LaudosController } from './laudos.controller';
import { LaudosService } from './laudos.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Laudo.name, schema: LaudoSchema }])],
  controllers: [LaudosController],
  providers: [LaudosService],
  exports: [LaudosService],
})
export class LaudosModule {}
