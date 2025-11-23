import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      console.log('Auth Controller - Register recebido:', createUserDto);
      console.log('Tipo de dados:', {
        name: typeof createUserDto.name,
        email: typeof createUserDto.email,
        password: typeof createUserDto.password,
      });
      console.log('Validações: name length =', createUserDto.name?.length, ', email valid =', createUserDto.email?.includes('@'), ', password length =', createUserDto.password?.length);
      
      if (!createUserDto.name || !createUserDto.email || !createUserDto.password) {
        throw new BadRequestException(
          'Campos obrigatórios faltando: name, email, password'
        );
      }
      
      const result = await this.authService.register(createUserDto);
      console.log('Registro bem-sucedido:', result);
      return result;
    } catch (error: any) {
      console.error('Erro no registro:', error.message || error);
      console.error('Stack:', error.stack);
      console.error('Erro completo:', error);
      throw error;
    }
  }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (error) {
      console.error('Erro no login:', error.message);
      throw error;
    }
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    // Redirect para o Google OAuth
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const token = this.authService.generateToken(user);
    // Redirecionar para o frontend com o token
    (res as any).redirect(`http://localhost:8081?token=${token}`);
  }
}
