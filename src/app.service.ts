import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './authCredentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await this.hashedPassword(salt, password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    try {
      const savedUser = await this.userRepository.save(user);
      return this.generateAndSendToken(savedUser);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return this.generateAndSendToken(user);
  }

  private async hashedPassword(
    salt: string,
    password: string,
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  private async generateAndSendToken(user: User) {
    const payload = { email: user.email };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
