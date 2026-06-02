import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {

constructor(private readonly authService: AuthService) {}

@Post('registro')
@UseInterceptors(FileInterceptor('fotoPerfil', {
    storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
    }
    })
}))
registro(@Body() registroDto: RegistroDto, @UploadedFile() file?: Express.Multer.File) {
    const fotoPerfil = file ? `/uploads/${file.filename}` : '';
    return this.authService.registro(registroDto, fotoPerfil);
}

@Post('login')
login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
}
}