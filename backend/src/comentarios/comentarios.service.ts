import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comentario } from './entities/comentario.entity';
import { CrearComentarioDto } from './dto/crear-comentario.dto';

@Injectable()
export class ComentariosService {

constructor(@InjectModel(Comentario.name) private comentarioModel: Model<Comentario>) {}

async crear(crearComentarioDto: CrearComentarioDto) {
    return this.comentarioModel.create(crearComentarioDto);
}

async listar(publicacionId: string, offset: number = 0, limit: number = 5) {
    return this.comentarioModel
    .find({ publicacionId, eliminado: false })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
}

async editar(id: string, texto: string, usuarioId: string) {
    const comentario = await this.comentarioModel.findById(id);
    if (!comentario) throw new NotFoundException('Comentario no encontrado');

    if (comentario.autorId !== usuarioId) {
    throw new ForbiddenException('Solo podés editar tus propios comentarios');
    }

    comentario.texto = texto;
    comentario.modificado = true;
    await comentario.save();
    return comentario;
}
}