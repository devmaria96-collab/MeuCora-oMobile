import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Laudo extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  data: string;

  @Prop()
  observacoes?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const LaudoSchema = SchemaFactory.createForClass(Laudo);
