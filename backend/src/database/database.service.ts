import { Inject, Injectable } from '@nestjs/common';
import { GameSession } from '@shared/domain/game';
import { RepositoryInterface } from 'adapters/adapter.interface';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('DATABASE_REPOSITORY')
    private readonly repository: RepositoryInterface,
  ) {}

  async getDatabaseState() {
    return this.repository.getGameSessions();
  }

  async getGameSessions(): Promise<GameSession[]> {
    return this.repository.getGameSessions();
  }

  async getGameSessionById(id: string): Promise<GameSession> {
    return this.repository.getGameSession(id);
  }

  async createGameSession(gameSession: GameSession): Promise<GameSession> {
    return this.repository.createGameSession(structuredClone(gameSession));
  }

  async updateGameSession(gameSession: GameSession): Promise<GameSession> {
    return this.repository.updateGameSession(structuredClone(gameSession));
  }
}
