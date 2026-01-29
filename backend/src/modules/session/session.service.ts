import { Injectable } from '@nestjs/common';
import { GameSession, MAX_PLAYERS_COUNT } from '@shared/domain/game';
import { DatabaseService } from 'database/database.service';

@Injectable()
export class SessionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createSession(gameSession: GameSession) {
    const session = await this.databaseService.createGameSession(gameSession);

    return {
      id: session.id,
    };
  }

  async getAvailableSessions() {
    const allGameSessions = await this.databaseService.getGameSessions();

    return allGameSessions
      .filter((session) => session.state.status === 'waiting')
      .map((session) => ({
        id: session.id,
      }));
  }

  async getSession(id: string) {
    const gameSessions = await this.databaseService.getGameSessions();

    return gameSessions.find((session) => session.id === id);
  }

  async isSessionFull(sessionId: string) {
    const gameSession = await this.getSession(sessionId);

    if (!gameSession) {
      return false;
    }

    return gameSession.state.players.length === MAX_PLAYERS_COUNT;
  }

  async addPlayerToSession(sessionId: string, playerId: string) {
    const gameSession = await this.getSession(sessionId);

    if (!gameSession) {
      throw new Error('Game session not found');
    }

    const updatedGameSession: GameSession = {
      ...gameSession,
      state: {
        ...gameSession.state,
        players: [...gameSession.state.players, { id: playerId }],
        currentScore: { ...gameSession.state.currentScore, [playerId]: 0 },
      },
    };

    return this.databaseService.updateGameSession(updatedGameSession);
  }

  async startGameSession(sessionId: string, currentPlayerId: string) {
    const gameSession = await this.getSession(sessionId);

    if (!gameSession) {
      throw new Error('Game session not found');
    }

    const updatedGameSession: GameSession = {
      ...gameSession,
      state: {
        ...gameSession.state,
        status: 'in_progress',
        currentPlayerId: currentPlayerId,
      },
    };

    return this.databaseService.updateGameSession(updatedGameSession);
  }

  async tryToFinishGameSession(sessionId: string) {
    const gameSession = await this.getSession(sessionId);

    if (!gameSession) {
      return;
    }

    const updatedGameSession: GameSession = {
      ...gameSession,
      state: {
        ...gameSession.state,
        status: 'finished',
      },
    };

    return this.databaseService.updateGameSession(updatedGameSession);
  }

  async getSessionByPlayerId(playerId: string) {
    const gameSessions = await this.databaseService.getGameSessions();

    return gameSessions.find((session) =>
      session.state.players.some((player) => player.id === playerId),
    );
  }
}
