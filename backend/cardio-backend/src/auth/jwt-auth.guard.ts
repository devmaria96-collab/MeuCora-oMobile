import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      console.log('🔓 Rota pública - bypass JWT');
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('🔐 JwtAuthGuard - Authorization Header:', authHeader ? authHeader.substring(0, 30) + '...' : 'Não enviado');
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      console.error('❌ JwtAuthGuard - Erro de autenticação:', { err, user, info });
    } else {
      console.log('✅ JwtAuthGuard - Usuário autenticado:', user);
    }
    return super.handleRequest(err, user, info, context);
  }
}
