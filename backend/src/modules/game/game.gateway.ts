import { UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { OpenCellEvent } from '@shared/events';
import { WEBSOCKET_EVENTS } from '@shared/events';
import { WebSocketExceptionFilter } from 'common/filters';
import { PlayerOrderGuard, SessionExistsGuard } from 'common/guards';
import { PayloadPipe } from 'common/pipes';
import { getSessionIdFromClient } from 'common/utils';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
  },
})
@UseFilters(WebSocketExceptionFilter)
// Handles game logic
export class GameGateway implements OnGatewayInit {
  constructor(private readonly gameService: GameService) {}
  @WebSocketServer()
  server: Server;

  afterInit(): void {
    console.info('Game gateway initialized');
  }

  @UseGuards(SessionExistsGuard, PlayerOrderGuard)
  @SubscribeMessage(WEBSOCKET_EVENTS.OPEN_CELL)
  async handleOpenCell(
    @MessageBody(PayloadPipe) payload: OpenCellEvent,
    @ConnectedSocket() client: Socket,
  ) {
    // We have guard guarantees
    const sessionId = getSessionIdFromClient(client)!;

    const currentRoom = this.server.sockets.adapter.rooms.get(sessionId);

    const isOpened = await this.gameService.checkIfCellIsOpenable(
      sessionId,
      payload.cellId,
    );

    if (!isOpened) {
      return;
    }

    const openedCell = await this.gameService.openCell(
      sessionId,
      payload.cellId,
    );

    const nextTurnPlayerId =
      await this.gameService.getCurrentPlayerId(sessionId);

    currentRoom?.forEach((playerId: string) => {
      this.server.to(playerId).emit(WEBSOCKET_EVENTS.CELL_OPENED, {
        openedCell,
        currentPlayerId: nextTurnPlayerId,
      });
    });

    const { finished, winnerId } =
      await this.gameService.checkIfGameIsFinished(sessionId);

    if (finished) {
      currentRoom?.forEach((playerId: string) => {
        this.server.to(playerId).emit(WEBSOCKET_EVENTS.GAME_FINISHED, {
          winnerId,
        });
      });
    }
  }
}
