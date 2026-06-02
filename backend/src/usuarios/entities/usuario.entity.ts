import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema()
export class Usuario {
@Prop({ required: true })
nombre: string;

@Prop({ required: true })
apellido: string;

@Prop({ required: true, unique: true })
email: string;

@Prop({ required: true, unique: true })
username: string;

@Prop({ required: true })
password: string;

@Prop({ required: true })
fechaNacimiento: string;

@Prop()
descripcion: string;

@Prop()
fotoPerfil: string;

@Prop({ default: 'usuario' })
perfil: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);