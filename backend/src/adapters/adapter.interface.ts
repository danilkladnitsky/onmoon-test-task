import { GameSession } from '@shared/domain/game';

export abstract class RepositoryInterface {
  abstract createGameSession(gameSession: GameSession): Promise<GameSession>;
  abstract getGameSession(id: string): Promise<GameSession>;
  abstract updateGameSession(gameSession: GameSession): Promise<GameSession>;
  abstract getGameSessions(): Promise<GameSession[]>;
}
