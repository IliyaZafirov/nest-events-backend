import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { SchoolModule } from './school/school.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true
      // envFilePath: '.env'
      // ignoreEnvFile: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd
    }),
    EventsModule,
    SchoolModule
  ],
  providers: [AppService]
})
export class AppModule { }
