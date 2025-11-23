import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Remedio extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  dosagem: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export const RemedioSchema = SchemaFactory.createForClass(Remedio);
