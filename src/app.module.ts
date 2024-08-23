import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3307,
    username: 'root',
    password: 'example',
    database: 'nest-events',
    entities: [Event],
    synchronize: true
  }),
  EventsModule
  ],
  providers: [AppService]
})
export class AppModule { }
