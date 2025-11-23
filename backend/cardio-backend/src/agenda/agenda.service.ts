import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agenda } from '../schemas/agenda.schema';
import { CreateAgendaDto } from './dto/create-agenda.dto';

@Injectable()
export class AgendaService {
  constructor(@InjectModel(Agenda.name) private agendaModel: Model<Agenda>) {}

  create(createAgendaDto: CreateAgendaDto, userId: string) {
    const createdAgenda = new this.agendaModel({
      ...createAgendaDto,
      userId,
    });
    return createdAgenda.save();
  }

  findAll(userId: string) {
    return this.agendaModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const agenda = await this.agendaModel.findById(id).exec();
    if (!agenda) {
      throw new NotFoundException('Agenda não encontrada');
    }
    if (agenda.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return agenda;
  }

  async update(id: string, updateAgendaDto: any, userId: string) {
    const agenda = await this.agendaModel.findById(id).exec();
    if (!agenda) {
      throw new NotFoundException('Agenda não encontrada');
    }
    if (agenda.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return this.agendaModel.findByIdAndUpdate(id, updateAgendaDto, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    const agenda = await this.agendaModel.findById(id).exec();
    if (!agenda) {
      throw new NotFoundException('Agenda não encontrada');
    }
    if (agenda.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return this.agendaModel.findByIdAndDelete(id).exec();
  }
}
