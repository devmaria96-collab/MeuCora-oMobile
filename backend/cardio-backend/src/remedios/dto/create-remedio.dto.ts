import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRemedioDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser um texto' })
  nome: string;

  @IsNotEmpty({ message: 'A dosagem é obrigatória' })
  @IsString({ message: 'A dosagem deve ser um texto' })
  dosagem: string;
}
