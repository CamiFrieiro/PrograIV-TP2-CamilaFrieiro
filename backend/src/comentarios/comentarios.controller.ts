import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CrearComentarioDto } from './dto/crear-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
constructor(private readonly comentariosService: ComentariosService) {}

@Post()
crear(@Body() crearComentarioDto: CrearComentarioDto) {
    return this.comentariosService.crear(crearComentarioDto);
}

@Get(':publicacionId')
listar(
    @Param('publicacionId') publicacionId: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
) {
    return this.comentariosService.listar(
    publicacionId,
    offset ? parseInt(offset) : 0,
    limit ? parseInt(limit) : 5
    );
}

@Put(':id')
editar(
    @Param('id') id: string,
    @Body('texto') texto: string,
    @Body('usuarioId') usuarioId: string,
) {
    return this.comentariosService.editar(id, texto, usuarioId);
}
}