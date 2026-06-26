import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CrearComentarioDto {
@IsString()
publicacionId: string;

@IsString()
@MaxLength(250)
texto: string;

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