import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  //Para usar  registrar en la base de datos
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService) {

  }

  async create(createUserDto: CreateUserDto) {
    //Desestructurar
    const numRound = 10;


    const { email, password } = createUserDto;
    //I. Verificamos que no existe usuario
    const emailExist = await this.userRepository.findOneBy({ email });
    if (emailExist) {
      const error = {
        "statusCode": 400,
        "error": "conflict",
        "message": ["El email ya existe"]
      }
      //Si se cumple la condicion el usuario existe en la DB
      throw new ConflictException(error);
    }
    //II. Encriptamos el password
    const hashPassword = await bcrypt.hash(password, numRound);
    createUserDto.password = hashPassword;
    //III. Save on db
    return this.userRepository.save(createUserDto);
  }

  async login(LoginUserDto: LoginUserDto) {
    //Desestructurar
    const { email, password } = LoginUserDto;
    //Verificar que el email existe
    const emailExist = await this.userRepository.findOneBy({ email });
    if (!emailExist) {
      const error = {
        "statusCode": 401,
        "error": "Not Found",
        "message": ["El usuario no existe"]
      }
      throw new NotFoundException(error)
    }
    //Comparar que pw sean uguali
    const matchPassword = await bcrypt.compare(password, emailExist.password);
    if (!matchPassword) {
      const error = {
        "statusCode": 404,
        "error": "Unauthorized exception",
        "message": ["Password incorrecto"]
      }
      throw new UnauthorizedException(error);
      //Se sono uguali, ritornare il token JWT
      //regresar  el token jwt
    }
    const payload = {
      sub: emailExist.id,
      name: emailExist.name,
      email: emailExist.email
    }

    const token = await this.jwtService.signAsync(payload)
    return {
      token,

    };
    //aqui estamos pasando la clave secreta del jwtmodule para firmar el payload que se envio al login y que va ser usado en el guard para desencriptarlo
    //el payload contiene la informacion del usuario que se envio al login para poder verificar que sea el mismo usuario que se esta haciendo la peticion 
    //el guard va a verificar que el token sea valido y que el payload sea el mismo que se envio al login

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
