import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
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
    folder: 'publicaciones',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
} as any,
});

@Controller('publicaciones')
export class PublicacionesController {
constructor(private readonly publicacionesService: PublicacionesService) {}

@Post()
@UseInterceptors(FileInterceptor('imagen', { storage }))
crear(@Body() crearPublicacionDto: CrearPublicacionDto, @UploadedFile() file?: Express.Multer.File) {
    const imagen = file ? (file as any).path : '';
    return this.publicacionesService.crear({ ...crearPublicacionDto, imagen });
}

@Get()
listar(
    @Query('ordenar') ordenar: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('autorId') autorId: string,
) {
    return this.publicacionesService.listar(
    ordenar,
    offset ? parseInt(offset) : 0,
    limit ? parseInt(limit) : 10,
    autorId
    );
}

@Delete(':id')
eliminar(
    @Param('id') id: string,
    @Body('usuarioId') usuarioId: string,
    @Body('perfil') perfil: string,
) {
    return this.publicacionesService.eliminar(id, usuarioId, perfil);
}

@Post(':id/like')
darLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.darLike(id, usuarioId);
}

@Delete(':id/like')
quitarLike(@Param('id') id: string, @Body('usuarioId') usuarioId: string) {
    return this.publicacionesService.quitarLike(id, usuarioId);
}

@Get(':id')
obtener(@Param('id') id: string) {
    return this.publicacionesService.obtener(id);
}
}