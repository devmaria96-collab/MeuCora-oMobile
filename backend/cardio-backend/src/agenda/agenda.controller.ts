import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';

@Controller('agenda')
@UseGuards(JwtAuthGuard)
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  create(@Request() req, @Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.create(createAgendaDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.agendaService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.agendaService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateAgendaDto: any) {
    return this.agendaService.update(id, updateAgendaDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.agendaService.remove(id, req.user.userId);
  }
}
