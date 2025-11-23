import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLaudoDto } from './dto/create-laudo.dto';
import { LaudosService } from './laudos.service';

@Controller('laudos')
@UseGuards(JwtAuthGuard)
export class LaudosController {
  constructor(private readonly laudosService: LaudosService) {}

  @Post()
  create(@Request() req, @Body() createLaudoDto: CreateLaudoDto) {
    return this.laudosService.create(createLaudoDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.laudosService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.laudosService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateLaudoDto: any) {
    return this.laudosService.update(id, updateLaudoDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.laudosService.remove(id, req.user.userId);
  }
}
