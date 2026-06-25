import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CrearPublicacionDto {
@IsString()
@MaxLength(80)
titulo: string;

@IsString()
@MaxLength(250)
descripcion: string;

@IsOptional()
@IsString()
imagen: string;

@IsString()
autorId: string;

@IsString()
autorNombre: string;

@IsString()
autorUsername: string;

@IsOptional()
@IsString()
autorAvatar: string;
}