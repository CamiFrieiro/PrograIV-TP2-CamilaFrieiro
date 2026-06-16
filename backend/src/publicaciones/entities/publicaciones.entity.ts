import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema({ timestamps: true })
export class Publicacion {
@Prop({ required: true })
titulo: string;

@Prop({ required: true })
descripcion: string;

@Prop()
imagen: string;

@Prop({ required: true })
autorId: string;

@Prop({ required: true })
autorNombre: string;

@Prop({ required: true })
autorUsername: string;

@Prop()
autorAvatar: string;

@Prop({ default: [] })
likes: string[]; 

@Prop({ default: false })
eliminada: boolean; 
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);