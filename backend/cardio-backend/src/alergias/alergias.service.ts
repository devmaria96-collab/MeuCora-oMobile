import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alergia } from '../schemas/alergia.schema';
import { CreateAlergiaDto } from './dto/create-alergia.dto';

@Injectable()
export class AlergiasService {
  constructor(@InjectModel(Alergia.name) private alergiaModel: Model<Alergia>) {}

  create(createAlergiaDto: CreateAlergiaDto, userId: string) {
    const createdAlergia = new this.alergiaModel({
      ...createAlergiaDto,
      userId,
    });
    return createdAlergia.save();
  }

  findAll(userId: string) {
    return this.alergiaModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const alergia = await this.alergiaModel.findById(id).exec();
    if (!alergia) {
      throw new NotFoundException('Alergia não encontrada');
    }
    if (alergia.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return alergia;
  }

  async update(id: string, updateAlergiaDto: any, userId: string) {
    const alergia = await this.alergiaModel.findById(id).exec();
    if (!alergia) {
      throw new NotFoundException('Alergia não encontrada');
    }
    if (alergia.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return this.alergiaModel.findByIdAndUpdate(id, updateAlergiaDto, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    const alergia = await this.alergiaModel.findById(id).exec();
    if (!alergia) {
      throw new NotFoundException('Alergia não encontrada');
    }
    if (alergia.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return this.alergiaModel.findByIdAndDelete(id).exec();
  }
}
