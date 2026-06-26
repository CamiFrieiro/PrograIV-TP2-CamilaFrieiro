import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

constructor(
private usuariosService: UsuariosService,
private jwtService: JwtService
) {}

async registro(registroDto: RegistroDto, fotoPerfil?: string) {
const usuarioExistente = await this.usuariosService.buscarPorEmail(registroDto.email);
if (usuarioExistente) {
    throw new BadRequestException('El correo ya está registrado');
}

const passwordEncriptada = await bcrypt.hash(registroDto.password, 10);

const nuevoUsuario = await this.usuariosService.crear({
    ...registroDto,
    password: passwordEncriptada,
    fotoPerfil: fotoPerfil || ''
});

const payload = {
    sub: nuevoUsuario._id,
    email: nuevoUsuario.email,
    perfil: nuevoUsuario.perfil
};

return {
    access_token: await this.jwtService.signAsync(payload),
    usuario: {
    id: nuevoUsuario._id,
    nombre: nuevoUsuario.nombre,
    apellido: nuevoUsuario.apellido,
    email: nuevoUsuario.email,
    username: nuevoUsuario.username,
    fotoPerfil: nuevoUsuario.fotoPerfil,
    perfil: nuevoUsuario.perfil,
    descripcion: nuevoUsuario.descripcion,
    fechaNacimiento: nuevoUsuario.fechaNacimiento
    }
};
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

const payload = {
    sub: usuario._id,
    email: usuario.email,
    perfil: usuario.perfil
};

return {
    access_token: await this.jwtService.signAsync(payload),
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

async autorizar(token: string) {
try {
    const payload = await this.jwtService.verifyAsync(token);
    const usuario = await this.usuariosService.buscarPorId(payload.sub);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

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
} catch {
    throw new UnauthorizedException('Token inválido o vencido');
}
}

async refrescar(token: string) {
try {
    const payload = await this.jwtService.verifyAsync(token);
    const nuevoPayload = {
    sub: payload.sub,
    email: payload.email,
    perfil: payload.perfil
    };
    return {
    access_token: await this.jwtService.signAsync(nuevoPayload)
    };
} catch {
    throw new UnauthorizedException('Token inválido o vencido');
}
}
}