import { Body, Controller, Inject, Post } from '@nestjs/common';
import { createGameField, GameSession } from '@shared/domain/game';
import { WEBSOCKET_EVENTS } from '@shared/events';
import { CreateSessionDto } from 'common/dtos';
import { SessionGateway } from 'modules/session/session.gateway';
import { SessionService } from 'modules/session/session.service';
import { randomUUID } from 'node:crypto';

@Controller('session')
export class SessionController {
  constructor(
    @Inject(SessionService) private readonly sessionService: SessionService,
    @Inject(SessionGateway) private readonly sessionGateway: SessionGateway,
  ) {}

  @Post()
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const { diamondsCount, size } = createSessionDto;

    const gameSession: GameSession = {
      id: randomUUID(),
      state: {
        maxDiamondsCount: diamondsCount,
        currentScore: {},
        field: createGameField({
          diamondsCount,
          size,
        }),
        players: [],
        status: 'waiting',
        currentPlayerId: null,
      },
    };

    const game = await this.sessionService.createSession(gameSession);

    const sessions = await this.sessionService.getAvailableSessions();

    this.sessionGateway.server.emit(WEBSOCKET_EVENTS.SESSIONS_LIST, sessions);

    return game;
  }
}
