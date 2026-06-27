import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from './entities/publicaciones.entity';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';

@Injectable()
export class PublicacionesService {

constructor(@InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>) {}

async crear(crearPublicacionDto: CrearPublicacionDto) {
    const publicacion = await this.publicacionModel.create(crearPublicacionDto);
    return publicacion;
}

async listar(ordenar: string = 'fecha', offset: number = 0, limit: number = 10, autorId?: string) {
    const filtro: any = { eliminada: false };
    if (autorId) filtro.autorId = autorId;

    if (ordenar === 'likes') {
    return this.publicacionModel.aggregate([
        { $match: filtro },
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: { likesCount: -1 } },
        { $skip: offset },
        { $limit: limit }
    ]);
    }

    return this.publicacionModel
    .find(filtro)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
}

async eliminar(id: string, usuarioId: string, perfil: string) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    if (publicacion.autorId !== usuarioId && perfil !== 'administrador') {
    throw new ForbiddenException('No tenés permiso para eliminar esta publicación');
    }

    publicacion.eliminada = true;
    await publicacion.save();
    return { mensaje: 'Publicación eliminada correctamente' };
}

async darLike(id: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    if (publicacion.likes.includes(usuarioId)) {
    return { mensaje: 'Ya le diste like a esta publicación' };
    }

    publicacion.likes.push(usuarioId);
    await publicacion.save();
    return { mensaje: 'Like agregado', likes: publicacion.likes.length };
}

async quitarLike(id: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new NotFoundException('Publicación no encontrada');

    if (!publicacion.likes.includes(usuarioId)) {
    return { mensaje: 'No le habías dado like a esta publicación' };
    }

    publicacion.likes = publicacion.likes.filter(id => id !== usuarioId);
    await publicacion.save();
    return { mensaje: 'Like eliminado', likes: publicacion.likes.length };
}

async obtener(id: string) {
    return this.publicacionModel.findById(id);
}

}