import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'your-secret-key';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    console.log('🔑 JwtStrategy inicializada com secret:', secret.substring(0, 10) + '...');
  }

  async validate(payload: any) {
    console.log('🔍 JwtStrategy.validate - payload recebido:', payload);
    const result = { userId: payload.sub, email: payload.email };
    console.log('✅ JwtStrategy.validate - retornando:', result);
    return result;
  }
}
