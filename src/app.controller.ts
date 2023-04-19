import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthCredentialsDto } from './authCredentials.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'signUp' })
  async signUp(@Payload() authCredentialsDto: AuthCredentialsDto) {
    const user = await this.appService.signUp(authCredentialsDto);
    return {
      ...user,
      message: 'User created',
      id: 1,
    };
  }

  @MessagePattern({ cmd: 'signIn' })
  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.appService.signIn(authCredentialsDto);
    return user;
  }
}
