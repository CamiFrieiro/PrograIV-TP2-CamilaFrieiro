import { Controller, Post, Body, UploadedFile, UseInterceptors, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
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

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}

@Post('registro')
@UseInterceptors(FileInterceptor('fotoPerfil', { storage }))
registro(@Body() registroDto: RegistroDto, @UploadedFile() file?: Express.Multer.File) {
    const fotoPerfil = file ? (file as any).path : '';
    return this.authService.registro(registroDto, fotoPerfil);
}

@Post('login')
login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
}

@Post('autorizar')
autorizar(@Headers('authorization') authorization: string) {
    if (!authorization) throw new UnauthorizedException('Token no proporcionado');
    const token = authorization.replace('Bearer ', '');
    return this.authService.autorizar(token);
}

@Post('refrescar')
refrescar(@Headers('authorization') authorization: string) {
    if (!authorization) throw new UnauthorizedException('Token no proporcionado');
    const token = authorization.replace('Bearer ', '');
    return this.authService.refrescar(token);
}
}