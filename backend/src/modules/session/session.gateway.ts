import { OnModuleDestroy, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MAX_PLAYERS_COUNT } from '@shared/domain/game';
import type { JoinSessionEvent } from '@shared/events';
import { WEBSOCKET_EVENTS } from '@shared/events';
import { WebSocketExceptionFilter } from 'common/filters';
import { SessionExistsGuard } from 'common/guards';
import { PayloadPipe } from 'common/pipes';
import { getSessionIdFromClient } from 'common/utils';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session.service';

@WebSocketGateway({
  port: 3000,
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
  },
})
@UseFilters(WebSocketExceptionFilter)
// Handles lobby and connecting to sessions
export class SessionGateway implements OnGatewayInit, OnModuleDestroy {
  constructor(private readonly sessionService: SessionService) {}
  @WebSocketServer()
  server: Server;

  afterInit(): void {
    console.log('Session gateway initialized');
  }

  async onModuleDestroy() {
    console.log('Session gateway is shutting down');
    this.server.emit(WEBSOCKET_EVENTS.SERVER_SHUTDOWN, {
      message: 'Server is shutting down',
    });
    await this.server.close();
  }

  async handleConnection(client: Socket) {
    const sessions = await this.sessionService.getAvailableSessions();
    client.emit(WEBSOCKET_EVENTS.SESSIONS_LIST, sessions);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    // since sessionId is null
    const playerId = client.id;

    const lastSession = await this.sessionService.getSessionByPlayerId(playerId);

    if (lastSession) {
      await this.sessionService.tryToFinishGameSession(lastSession.id);
      this.server.to(lastSession.id).emit(WEBSOCKET_EVENTS.PLAYER_LEFT, {
        playerId,
      });
    }
  }

  @SubscribeMessage(WEBSOCKET_EVENTS.JOIN_SESSION)
  async handleJoinSession(
    @MessageBody(PayloadPipe) { sessionId }: JoinSessionEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const isSessionFull = await this.sessionService.isSessionFull(sessionId);

    // TODO: add guard for this
    if (isSessionFull) {
      return;
    }

    await this.sessionService.addPlayerToSession(sessionId, client.id);
    await client.join(sessionId);

    // Assign player id to the client
    client.emit(WEBSOCKET_EVENTS.CURRENT_PLAYER_ID, client.id);
    client.emit(WEBSOCKET_EVENTS.SESSION_JOINED);

    // Send event to all players in the room
    this.server.to(sessionId).emit(WEBSOCKET_EVENTS.PLAYER_JOINED, {
      playerId: client.id,
    });

    const currentRoom = this.server.sockets.adapter.rooms.get(sessionId);

    const isRoomFull = currentRoom?.size === MAX_PLAYERS_COUNT;

    if (!isRoomFull || !currentRoom) {
      return;
    }

    const gameSession = await this.sessionService.startGameSession(sessionId, client.id);

    //  send event to all players in the room
    this.server.to(sessionId).emit(WEBSOCKET_EVENTS.START_SESSION, {
      sessionId,
      currentPlayerId: client.id,
      diamondsCount: gameSession.state.maxDiamondsCount,
      size: gameSession.state.field.length,
    });

    // Since current session started, we need to update the list of available sessions for other players in lobby
    this.server.emit(
      WEBSOCKET_EVENTS.SESSIONS_LIST,
      await this.sessionService.getAvailableSessions(),
    );
  }

  @SubscribeMessage(WEBSOCKET_EVENTS.LEAVE_SESSION)
  @UseGuards(SessionExistsGuard)
  async handleLeaveSession(@ConnectedSocket() client: Socket) {
    const sessionId = getSessionIdFromClient(client)!;

    this.server.to(sessionId).emit(WEBSOCKET_EVENTS.PLAYER_LEFT, {
      playerId: client.id,
    });

    await Promise.all([
      client.leave(sessionId),
      // Not throwing, safe for promise all
      this.sessionService.tryToFinishGameSession(sessionId),
    ]);

    const sessions = await this.sessionService.getAvailableSessions();

    client.emit(WEBSOCKET_EVENTS.SESSIONS_LIST, sessions);
  }
}
