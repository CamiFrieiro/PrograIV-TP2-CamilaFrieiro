import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion } from '../publicaciones/entities/publicaciones.entity';
import { Comentario } from '../comentarios/entities/comentario.entity';

@Injectable()
export class EstadisticasService {

constructor(
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    @InjectModel(Comentario.name) private comentarioModel: Model<Comentario>
) {}

async publicacionesPorUsuario(desde: Date, hasta: Date) {
    return this.publicacionModel.aggregate([
    { $match: { createdAt: { $gte: desde, $lte: hasta }, eliminada: false } },
    { $group: { _id: '$autorNombre', cantidad: { $sum: 1 } } },
    { $sort: { cantidad: -1 } }
    ]);
}

async comentariosEnLapso(desde: Date, hasta: Date) {
    return this.comentarioModel.aggregate([
    { $match: { createdAt: { $gte: desde, $lte: hasta }, eliminado: false } },
    {
        $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        cantidad: { $sum: 1 }
        }
    },
    { $sort: { _id: 1 } }
    ]);
}

async comentariosPorPublicacion(desde: Date, hasta: Date) {
    return this.comentarioModel.aggregate([
    { $match: { createdAt: { $gte: desde, $lte: hasta }, eliminado: false } },
    { $group: { _id: '$publicacionId', cantidad: { $sum: 1 } } },
    { $sort: { cantidad: -1 } }
    ]);
}
}