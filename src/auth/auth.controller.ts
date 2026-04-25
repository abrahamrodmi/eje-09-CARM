import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { type } from 'os';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: User, description: "Usuario creado exitosamente" })
  @ApiResponse({ status: 400, description: 'El email ya existe' })
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({ type: User, description: "Acceso concedido", schema: { example: { token: "token" } } })
  @ApiNotFoundResponse({ description: "El usuario no existe" })
  @ApiUnauthorizedResponse({ description: "Password incorrecto" })
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth()
  //ruta o endpoint protegido mediante un guard, el cual va validar el token que se envia en la peticion
  //sin el token no se puede acceder a esta ruta
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Usuario logueado exitosamente' })
  @ApiResponse({ status: 401, description: 'El usuario no existe' })
  @ApiResponse({ status: 404, description: 'Password incorrecto' })
  @Get('/profile')
  profile(@Request() req) {
    // req.user contiene el payload del token que fue inyectado por el AuthGuard
    return "estas viendo perfiles protegidos por un token valido y verificado" + req.user;
  }


}
