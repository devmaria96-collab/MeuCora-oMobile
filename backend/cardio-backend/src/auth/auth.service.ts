import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      console.log('AuthService.register - iniciando com:', createUserDto);
      
      // Verificar se email já existe
      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException('Email já cadastrado');
      }

      // Hash da senha
      console.log('AuthService - Iniciando hash da senha...');
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      console.log('AuthService - Senha hasheada com sucesso');
      
      console.log('AuthService - Criando usuário no banco de dados...');
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
      console.log('AuthService - Usuário criado:', user);

      const userId = user._id.toString();
      console.log('AuthService - userId para token:', userId);
      const token = this.jwtService.sign({ sub: userId, email: user.email });
      console.log('AuthService - Token gerado com sucesso');
      
      return {
        access_token: token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.error('BadRequestException:', error.message);
        throw error;
      }
      console.error('Erro ao registrar usuário:', error);
      throw new BadRequestException('Erro ao registrar usuário. Tente novamente.');
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('Email ou senha inválidos');
      }

      // Comparar senha com hash
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Email ou senha inválidos');
      }

      const userId = user._id.toString();
      console.log('AuthService - userId para token (login):', userId);
      const token = this.jwtService.sign({ sub: userId, email: user.email });
      return {
        access_token: token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Erro ao fazer login:', error);
      throw new BadRequestException('Erro ao fazer login. Tente novamente.');
    }
  }

  generateToken(user: any) {
    const userId = user._id.toString();
    return this.jwtService.sign({ sub: userId, email: user.email });
  }
}
