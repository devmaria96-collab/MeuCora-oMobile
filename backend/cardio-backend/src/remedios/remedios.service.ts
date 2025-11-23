import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Remedio } from '../schemas/remedio.schema';
import { CreateRemedioDto } from './dto/create-remedio.dto';

@Injectable()
export class RemediosService {
  constructor(@InjectModel(Remedio.name) private remedioModel: Model<Remedio>) {}

  create(createRemedioDto: CreateRemedioDto, userId: string) {
    console.log('Service - Criando remédio para userId:', userId);
    console.log('Service - Dados:', createRemedioDto);
    const createdRemedio = new this.remedioModel({
      ...createRemedioDto,
      userId,
    });
    return createdRemedio.save();
  }

  findAll(userId: string) {
    console.log('Service - Buscando remédios do userId:', userId);
    return this.remedioModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const remedio = await this.remedioModel.findById(id).exec();
    if (!remedio) {
      throw new NotFoundException('Remédio não encontrado');
    }
    if (remedio.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return remedio;
  }

  async update(id: string, updateRemedioDto: any, userId: string) {
    const remedio = await this.remedioModel.findById(id).exec();
    if (!remedio) {
      throw new NotFoundException('Remédio não encontrado');
    }
    if (remedio.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return this.remedioModel.findByIdAndUpdate(id, updateRemedioDto, { new: true }).exec();
  }

  async remove(id: string, userId: string) {
    const remedio = await this.remedioModel.findById(id).exec();
    if (!remedio) {
      throw new NotFoundException('Remédio não encontrado');
    }
    if (remedio.userId.toString() !== userId) {
      throw new UnauthorizedException('Acesso negado');
    }
    return this.remedioModel.findByIdAndDelete(id).exec();
  }
}
