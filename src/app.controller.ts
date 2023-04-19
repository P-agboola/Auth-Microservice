import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthCredentialsDto } from './authCredentials.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'signUp' })
  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.appService.signUp(authCredentialsDto);
    return {
      ...user,
      id: 1,
    };
  }

  @MessagePattern({ cmd: 'signIn' })
  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.appService.signIn(authCredentialsDto);
    return user;
  }
}
