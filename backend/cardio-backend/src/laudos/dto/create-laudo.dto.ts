import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLaudoDto {
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser um texto' })
  titulo: string;

  @IsNotEmpty({ message: 'A data é obrigatória' })
  @IsString({ message: 'A data deve ser um texto' })
  data: string;

  @IsOptional()
  @IsString({ message: 'As observações devem ser um texto' })
  observacoes?: string;
}
