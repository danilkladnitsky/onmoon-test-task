import { Injectable } from '@nestjs/common';
import { createGameField, GameSession } from '@shared/domain/game';
import { RepositoryInterface } from 'adapters/adapter.interface';
import { randomUUID } from 'node:crypto';

type InMemoryDatabaseState = {
  gameSessions: GameSession[];
};

const DATABASE_STATE: InMemoryDatabaseState = {
  gameSessions: [
    {
      id: randomUUID(),
      state: {
        // Mocked for simplicity
        maxDiamondsCount: 7,
        currentScore: {},
        currentPlayerId: null,
        status: 'waiting',
        field: createGameField({
          diamondsCount: 7,
          size: 6,
        }),
        players: [],
      },
    },
  ],
};

@Injectable()
export class InMemoryAdapter implements RepositoryInterface {
  async getGameSessions(): Promise<GameSession[]> {
    return await Promise.resolve(DATABASE_STATE.gameSessions);
  }

  async getGameSession(id: string): Promise<GameSession> {
    const gameSession = DATABASE_STATE.gameSessions.find(
      (gameSession) => gameSession.id === id,
    );

    if (!gameSession) {
      throw new Error('Game session not found');
    }

    return await Promise.resolve(gameSession);
  }

  async updateGameSession(gameSession: GameSession): Promise<GameSession> {
    const gameSessionIndex = DATABASE_STATE.gameSessions.findIndex(
      (session) => session.id === gameSession.id,
    );

    if (gameSessionIndex === -1) {
      throw new Error('Game session not found');
    }

    DATABASE_STATE.gameSessions = DATABASE_STATE.gameSessions.map((session) =>
      session.id === gameSession.id ? gameSession : session,
    );

    return await Promise.resolve(DATABASE_STATE.gameSessions[gameSessionIndex]);
  }

  async connect(): Promise<void> {
    return Promise.resolve();
  }

  async createGameSession(gameSession: GameSession): Promise<GameSession> {
    const pushedIndex = DATABASE_STATE.gameSessions.push(gameSession);
    return await Promise.resolve(DATABASE_STATE.gameSessions[pushedIndex - 1]);
  }
}
