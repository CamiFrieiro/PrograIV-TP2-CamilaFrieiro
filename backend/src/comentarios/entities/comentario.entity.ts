import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ComentarioDocument = HydratedDocument<Comentario>;

@Schema({ timestamps: true })
export class Comentario {
@Prop({ required: true })
publicacionId: string;

@Prop({ required: true })
texto: string;

@Prop({ required: true })
autorId: string;

@Prop({ required: true })
autorNombre: string;

@Prop({ required: true })
autorUsername: string;

@Prop()
autorAvatar: string;

@Prop({ default: false })
modificado: boolean;

@Prop({ default: false })
eliminado: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);