import { Controller, Get, Query, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('estadisticas')
@UseGuards(AuthGuard)
export class EstadisticasController {
constructor(private readonly estadisticasService: EstadisticasService) {}

private verificarAdmin(req: any) {
    if (req.user.perfil !== 'administrador') {
    throw new ForbiddenException('Solo los administradores pueden ver estadísticas');
    }
}

@Get('publicaciones-por-usuario')
publicacionesPorUsuario(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Request() req: any
) {
    this.verificarAdmin(req);
    return this.estadisticasService.publicacionesPorUsuario(new Date(desde), new Date(hasta));
}

@Get('comentarios-en-lapso')
comentariosEnLapso(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Request() req: any
) {
    this.verificarAdmin(req);
    return this.estadisticasService.comentariosEnLapso(new Date(desde), new Date(hasta));
}

@Get('comentarios-por-publicacion')
comentariosPorPublicacion(
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
    @Request() req: any
) {
    this.verificarAdmin(req);
    return this.estadisticasService.comentariosPorPublicacion(new Date(desde), new Date(hasta));
}
}