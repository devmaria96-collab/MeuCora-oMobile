import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlergiaDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser um texto' })
  nome: string;

  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  @IsString({ message: 'O tipo deve ser um texto' })
  tipo: string;
}
