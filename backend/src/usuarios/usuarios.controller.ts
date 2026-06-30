import { Controller, Get, Post, Delete, Param, Body, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { AuthGuard } from '../guards/auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('usuarios')
@UseGuards(AuthGuard)
export class UsuariosController {
constructor(private readonly usuariosService: UsuariosService) {}

private verificarAdmin(req: any) {
    if (req.user.perfil !== 'administrador') {
    throw new ForbiddenException('Solo los administradores pueden realizar esta acción');
    }
}

@Get()
listar(@Request() req: any) {
    this.verificarAdmin(req);
    return this.usuariosService.listar();
}

@Post()
async crear(@Body() crearUsuarioDto: CrearUsuarioDto, @Request() req: any) {
    this.verificarAdmin(req);
    const passwordEncriptada = await bcrypt.hash(crearUsuarioDto.password, 10);
    return this.usuariosService.crear({
    ...crearUsuarioDto,
    password: passwordEncriptada,
    fotoPerfil: ''
    });
}

@Delete(':id')
deshabilitar(@Param('id') id: string, @Request() req: any) {
    this.verificarAdmin(req);
    return this.usuariosService.deshabilitar(id);
}

@Post(':id/habilitar')
habilitar(@Param('id') id: string, @Request() req: any) {
    this.verificarAdmin(req);
    return this.usuariosService.habilitar(id);
}
}