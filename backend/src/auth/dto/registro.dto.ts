import { IsString, IsEmail, IsDateString, IsOptional, MinLength, Matches } from 'class-validator';

export class RegistroDto {
@IsString()
nombre: string;

@IsString()
apellido: string;

@IsEmail()
email: string;

@IsString()
username: string;

@IsString()
@MinLength(8)
@Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
message: 'La contraseña debe tener al menos una mayuscula y un numero'
})
password: string;

@IsDateString()
fechaNacimiento: string;

@IsOptional()
@IsString()
descripcion: string;

@IsOptional()
@IsString()
perfil: string;
}