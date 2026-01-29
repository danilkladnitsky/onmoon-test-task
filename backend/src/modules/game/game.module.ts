import { Module } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import { SessionModule } from 'modules/session/session.module';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [DatabaseModule, SessionModule],
  providers: [GameService, GameGateway],
})
export class GameModule {}
