import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alergia, AlergiaSchema } from '../schemas/alergia.schema';
import { AlergiasController } from './alergias.controller';
import { AlergiasService } from './alergias.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Alergia.name, schema: AlergiaSchema }])],
  controllers: [AlergiasController],
  providers: [AlergiasService],
  exports: [AlergiasService],
})
export class AlergiasModule {}
