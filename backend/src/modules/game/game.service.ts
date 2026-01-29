import { Injectable } from '@nestjs/common';
import {
  GameSession,
  GameSessionCell,
  getCellById,
  updateCell,
} from '@shared/domain/game';

import { DatabaseService } from 'database/database.service';

@Injectable()
export class GameService {
  constructor(private readonly databaseService: DatabaseService) {}

  async checkIfGameIsFinished(sessionId: string) {
    const gameSession =
      await this.databaseService.getGameSessionById(sessionId);

    if (!gameSession) {
      throw new Error('Game session not found');
    }

    let currentMaxScore = 0;
    let winnerId = gameSession.state.players[0].id;

    const totalScore = Object.values(gameSession.state.currentScore).reduce(
      (acc, score) => acc + score,
      0,
    );

    if (totalScore < gameSession.state.maxDiamondsCount) {
      return { finished: false, winnerId: null };
    }

    // Diamonds count is odd, so we can have only one winner
    Object.entries(gameSession.state.currentScore).forEach(
      ([playerId, score]) => {
        if (score > currentMaxScore) {
          currentMaxScore = score;
          winnerId = playerId;
        }
      },
    );

    return { finished: true, winnerId };
  }

  async checkIfCellIsOpenable(sessionId: string, cellId: string) {
    const gameSession =
      await this.databaseService.getGameSessionById(sessionId);

    if (!gameSession) {
      throw new Error('Game session not found');
    }

    const cell = getCellById(gameSession.state.field, cellId);

    if (!cell) {
      throw new Error('Cell not found');
    }

    return !cell.opened;
  }

  async openCell(sessionId: string, cellId: string) {
    const gameSession =
      await this.databaseService.getGameSessionById(sessionId);

    if (!gameSession) {
      throw new Error('Game session not found');
    }

    const { field } = gameSession.state;

    const cell = getCellById(field, cellId);

    if (!cell) {
      throw new Error('Cell not found');
    }

    if (cell.opened) {
      return;
    }

    let nextPlayerId = gameSession.state.currentPlayerId;

    if (cell.hasDiamond && nextPlayerId) {
      gameSession.state.currentScore[nextPlayerId]++;
    }

    nextPlayerId = cell.hasDiamond
      ? gameSession.state.currentPlayerId
      : gameSession.state.players.find(
          (player) => player.id !== gameSession.state.currentPlayerId,
        )?.id || null;

    if (!nextPlayerId) {
      throw new Error('Next player not found');
    }

    const openedCell: GameSessionCell = {
      ...cell,
      opened: true,
    };

    const updatedField = updateCell(field, cellId, openedCell);

    const updatedGameSession: GameSession = {
      ...gameSession,
      state: {
        ...gameSession.state,
        field: updatedField,
        currentPlayerId: nextPlayerId,
      },
    };

    await this.databaseService.updateGameSession(updatedGameSession);

    return openedCell;
  }

  async getCurrentPlayerId(sessionId: string) {
    const gameSession =
      await this.databaseService.getGameSessionById(sessionId);

    if (!gameSession) {
      return null;
    }

    return gameSession.state.currentPlayerId;
  }
}
