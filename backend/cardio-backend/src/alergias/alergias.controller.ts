import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AlergiasService } from './alergias.service';
import { CreateAlergiaDto } from './dto/create-alergia.dto';

@Controller('alergias')
@UseGuards(JwtAuthGuard)
export class AlergiasController {
  constructor(private readonly alergiasService: AlergiasService) {}

  @Post()
  create(@Request() req, @Body() createAlergiaDto: CreateAlergiaDto) {
    console.log('AlergiasController.create - req.user:', req.user);
    console.log('AlergiasController.create - body:', createAlergiaDto);
    return this.alergiasService.create(createAlergiaDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.alergiasService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.alergiasService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateAlergiaDto: any) {
    return this.alergiasService.update(id, updateAlergiaDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.alergiasService.remove(id, req.user.userId);
  }
}
