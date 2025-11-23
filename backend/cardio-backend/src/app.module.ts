import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AgendaModule } from './agenda/agenda.module';
import { AlergiasModule } from './alergias/alergias.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LaudosModule } from './laudos/laudos.module';
import { RemediosModule } from './remedios/remedios.module';
import { Agenda, AgendaSchema } from './schemas/agenda.schema';
import { Alergia, AlergiaSchema } from './schemas/alergia.schema';
import { Laudo, LaudoSchema } from './schemas/laudo.schema';
import { Remedio, RemedioSchema } from './schemas/remedio.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Conectar ao MongoDB local
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/Meucoracao'),
    // Registrar os schemas globalmente
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Agenda.name, schema: AgendaSchema },
      { name: Alergia.name, schema: AlergiaSchema },
      { name: Laudo.name, schema: LaudoSchema },
      { name: Remedio.name, schema: RemedioSchema },
    ]),
    AgendaModule,
    AlergiasModule,
    LaudosModule,
    RemediosModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
