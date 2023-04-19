import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user.entity';

console.log(process.env.host);
console.log(process.env.password);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.db_host,
  port: parseInt(process.env.db_port),
  username: process.env.db_username,
  password: process.env.db_password || 'My-password@123',
  database: process.env.db_database,
  entities: [User],
  synchronize: true,
};
