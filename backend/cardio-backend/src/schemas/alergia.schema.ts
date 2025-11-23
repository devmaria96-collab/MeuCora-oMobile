import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Alergia extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  tipo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const AlergiaSchema = SchemaFactory.createForClass(Alergia);
