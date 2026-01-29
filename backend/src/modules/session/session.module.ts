import { Module } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import { SessionController } from './session.controller';
import { SessionGateway } from './session.gateway';
import { SessionService } from './session.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionController],
  providers: [SessionService, SessionGateway],
  exports: [SessionService, SessionGateway],
})
export class SessionModule {}
