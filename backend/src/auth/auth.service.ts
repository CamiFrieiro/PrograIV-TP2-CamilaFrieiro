import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

constructor(private usuariosService: UsuariosService) {}

async registro(registroDto: RegistroDto, fotoPerfil?: string) {
    const usuarioExistente = await this.usuariosService.buscarPorEmail(registroDto.email);
    if (usuarioExistente) {
    throw new BadRequestException('El correo ya está registrado');
    }

    const passwordEncriptada = await bcrypt.hash(registroDto.password, 10);

    await this.usuariosService.crear({
    ...registroDto,
    password: passwordEncriptada,
    fotoPerfil: fotoPerfil || ''
    });

    return { mensaje: 'Usuario registrado correctamente' };
}

async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorEmail(loginDto.email);
    if (!usuario) {
    throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordValida = await bcrypt.compare(loginDto.password, usuario.password);
    if (!passwordValida) {
    throw new UnauthorizedException('Credenciales incorrectas');
    }

    return {
    usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        username: usuario.username,
        fotoPerfil: usuario.fotoPerfil,
        perfil: usuario.perfil,
        descripcion: usuario.descripcion,
        fechaNacimiento: usuario.fechaNacimiento
    }
    };
}
}