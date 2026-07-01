import { Controller, Get, Post, Delete, Param, Body, UseGuards, ForbiddenException, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { AuthGuard } from '../guards/auth.guard';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'perfiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

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
@UseInterceptors(FileInterceptor('fotoPerfil', { storage }))
async crear(@Body() crearUsuarioDto: CrearUsuarioDto, @Request() req: any, @UploadedFile() file?: Express.Multer.File) {
    this.verificarAdmin(req);
    const passwordEncriptada = await bcrypt.hash(crearUsuarioDto.password, 10);
    const fotoPerfil = file ? (file as any).path : '';
    return this.usuariosService.crear({
    ...crearUsuarioDto,
    password: passwordEncriptada,
    fotoPerfil
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