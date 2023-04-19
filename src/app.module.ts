import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from 'config/config';
import { AppController } from './app.controller';
import { User } from './user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.db_host,
      port: parseInt(process.env.db_port),
      username: process.env.db_username,
      password: process.env.db_password || 'My-password@123',
      database: process.env.db_database,
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.Jwt_Secret,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AppModule {}
