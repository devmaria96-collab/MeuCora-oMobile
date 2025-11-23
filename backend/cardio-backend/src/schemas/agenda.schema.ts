import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Agenda extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop()
  medico?: string;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true })
  horario: string;

  @Prop()
  local?: string;

  @Prop()
  observacoes?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const AgendaSchema = SchemaFactory.createForClass(Agenda);
