import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgendaDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser um texto' })
  titulo: string;

  @IsOptional()
  @IsString({ message: 'O médico deve ser um texto' })
  medico?: string;

  @IsNotEmpty({ message: 'A data é obrigatória' })
  @IsString({ message: 'A data deve ser um texto' })
  data: string;

  @IsNotEmpty({ message: 'O horário é obrigatório' })
  @IsString({ message: 'O horário deve ser um texto' })
  horario: string;

  @IsOptional()
  @IsString({ message: 'O local deve ser um texto' })
  local?: string;

  @IsOptional()
  @IsString({ message: 'As observações devem ser um texto' })
  observacoes?: string;
}
