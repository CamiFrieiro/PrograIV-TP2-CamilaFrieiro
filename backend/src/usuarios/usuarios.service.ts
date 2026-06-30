import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Injectable()
export class UsuariosService {

constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}

async crear(crearUsuarioDto: CrearUsuarioDto) {
const usuario = await this.usuarioModel.create(crearUsuarioDto);
return usuario;
}

async buscarPorEmail(email: string) {
return this.usuarioModel.findOne({ email });
}

async buscarPorId(id: string) {
return this.usuarioModel.findById(id);
}

async actualizar(id: string, datos: Partial<CrearUsuarioDto>) {
return this.usuarioModel.findByIdAndUpdate(id, datos, { new: true });
}

async listar() {
return this.usuarioModel.find().select('-password');
}

async deshabilitar(id: string) {
const usuario = await this.usuarioModel.findById(id);
if (!usuario) throw new NotFoundException('Usuario no encontrado');
usuario.habilitado = false;
await usuario.save();
return { mensaje: 'Usuario deshabilitado correctamente' };
}

async habilitar(id: string) {
const usuario = await this.usuarioModel.findById(id);
if (!usuario) throw new NotFoundException('Usuario no encontrado');
usuario.habilitado = true;
await usuario.save();
return { mensaje: 'Usuario habilitado correctamente' };
}
}