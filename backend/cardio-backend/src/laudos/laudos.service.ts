import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Laudo } from '../schemas/laudo.schema';
import { CreateLaudoDto } from './dto/create-laudo.dto';

@Injectable()
export class LaudosService {
  constructor(@InjectModel(Laudo.name) private laudoModel: Model<Laudo>) {}

  create(createLaudoDto: CreateLaudoDto, userId: string) {
    const createdLaudo = new this.laudoModel({
      ...createLaudoDto,
      userId,
    });
    return createdLaudo.save();
  }

  findAll(userId: string) {
    return this.laudoModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const laudo = await this.laudoModel.findById(id).exec();
    if (!laudo) {
      throw new NotFoundException('Laudo não encontrado');
    }
    if (laudo.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return laudo;
  }

  async update(id: string, updateLaudoDto: any, userId: string) {
    const laudo = await this.laudoModel.findById(id).exec();
    if (!laudo) {
      throw new NotFoundException('Laudo não encontrado');
    }
    if (laudo.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return this.laudoModel.findByIdAndUpdate(id, updateLaudoDto, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    const laudo = await this.laudoModel.findById(id).exec();
    if (!laudo) {
      throw new NotFoundException('Laudo não encontrado');
    }
    if (laudo.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return this.laudoModel.findByIdAndDelete(id).exec();
  }
}
