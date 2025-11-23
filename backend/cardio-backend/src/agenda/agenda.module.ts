import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Agenda, AgendaSchema } from '../schemas/agenda.schema';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Agenda.name, schema: AgendaSchema }])],
  controllers: [AgendaController],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule {}
