import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRemedioDto } from './dto/create-remedio.dto';
import { RemediosService } from './remedios.service';

@Controller('remedios')
@UseGuards(JwtAuthGuard)
export class RemediosController {
  constructor(private readonly remediosService: RemediosService) {}

  @Post()
  create(@Request() req, @Body() createRemedioDto: CreateRemedioDto) {
    console.log('Controller - User autenticado:', req.user);
    console.log('Controller - Dados recebidos:', createRemedioDto);
    return this.remediosService.create(createRemedioDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    console.log('Controller - Buscando remédios do usuário:', req.user.userId);
    return this.remediosService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.remediosService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateRemedioDto: any) {
    return this.remediosService.update(id, updateRemedioDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.remediosService.remove(id, req.user.userId);
  }
}
