import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GameService } from 'modules/game/game.service';
import { SessionService } from 'modules/session/session.service';
import { Socket } from 'socket.io';
import { getSessionIdFromClient } from './utils';

@Injectable()
export class PlayerOrderGuard implements CanActivate {
  constructor(private readonly gameService: GameService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();

    const sessionId = getSessionIdFromClient(client);

    if (!sessionId) {
      return false;
    }

    const currentPlayerId =
      await this.gameService.getCurrentPlayerId(sessionId);

    return currentPlayerId === client.id;
  }
}

@Injectable()
export class SessionExistsGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const sessionId = getSessionIdFromClient(client);

    if (!sessionId) {
      return false;
    }

    const session = await this.sessionService.getSession(sessionId);
    return Boolean(session);
  }
}
