import { Module } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import { SessionModule } from 'modules/session/session.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [GameModule, DatabaseModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
