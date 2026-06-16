import { IsString, IsOptional } from 'class-validator';

export class CrearPublicacionDto {
@IsString()
titulo: string;

@IsString()
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