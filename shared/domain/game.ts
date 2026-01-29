import type { Player } from './player';

// TODO: Move to app config
export const GAME_SESSION_DIMENSION = 6;
export const MAX_PLAYERS_COUNT = 2;

export type GameSettings = {
  diamondsCount: number;
  size: number;
};

export type GameServer = {
  id: string;
};

export type GameSession = {
  id: string;
  state: GameSessionState;
};

export type GameSessionCell = {
  id: string;
  opened: boolean;
  hasDiamond: boolean;
  nearestDiamondsCount: number;
};

export type GameSessionStatus = 'waiting' | 'in_progress' | 'finished';

export type GameSessionState = {
  field: GameSessionCell[][];
  players: Player[];
  maxDiamondsCount: number;
  // TODO: Save in different collection where we can track entire game flow and rewind it if needed
  currentScore: Record<string, number>;
  // Player who is currently making a move
  currentPlayerId: string | null;
  status: GameSessionStatus;
};

export const generateGameGrid = (size: number) => {
  return Array.from({ length: size }, (_, indexX) =>
    Array.from({ length: size }, (_, indexY) => ({
      id: createCellId(indexX, indexY),
      opened: false,
      hasDiamond: false,
      nearestDiamondsCount: 0,
    })),
  );
}

export const createGameField = ({
  diamondsCount = 7,
  size = GAME_SESSION_DIMENSION,
}: GameSettings): GameSessionCell[][] => {
  if (diamondsCount > size * size) {
    throw new Error('Diamonds count is greater than the field size');
  } else if (diamondsCount < 0) {
    throw new Error('Diamonds count cannot be negative');
  } else if (diamondsCount % 2 === 0) {
    throw new Error('Diamonds count must be odd');
  }

  const field = generateGameGrid(size);

  let placedDiamondsCount = 0;
  let iterationsCount = 0;

  // Just in case Math.random() is not random enough
  const MAX_ITERATIONS_COUNT = 100;

  while (
    placedDiamondsCount < diamondsCount &&
    iterationsCount < MAX_ITERATIONS_COUNT
  ) {
    const randomRow = Math.floor(Math.random() * size);
    const randomColumn = Math.floor(Math.random() * size);

    iterationsCount++;

    if (!field[randomRow][randomColumn].hasDiamond) {
      field[randomRow][randomColumn].hasDiamond = true;
      placedDiamondsCount++;
    }
  }

  const cellOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (field[i][j].hasDiamond) continue;

      let count = 0;
      for (const [xOffset, yOffset] of cellOffsets) {
        const nx = i + xOffset;
        const ny = j + yOffset;
        if (
          nx >= 0 &&
          nx < size &&
          ny >= 0 &&
          ny < size &&
          field[nx][ny].hasDiamond
        ) {
          count++;
        }
      }
      field[i][j].nearestDiamondsCount = count;
    }
  }

  return field;
};

export const createCellId = (x: number, y: number) => {
  return `${x}-${y}`;
}

export const decodeCellId = (id: string) => {
  return id.split('-').map(Number) as [number, number];
}

export const getCellById = (field: GameSessionCell[][], id: string): GameSessionCell => {
  const [x, y] = decodeCellId(id);
  return field[x][y];
}

export const updateCell = (field: GameSessionCell[][], id: string, cell: GameSessionCell): GameSessionCell[][] => {
  const [x, y] = decodeCellId(id);
  field[x][y] = cell;
  return field;
}

export const generateRandomSessionSettings = (): GameSettings => {
  // TODO: add more restrictions to cover cases like 1 diamond and 1x1 cell (but its funny to play)
  const size = Math.floor(Math.random() * GAME_SESSION_DIMENSION) + 1;

  const maxCells = size * size;
  const oddCount = Math.ceil(maxCells / 2);
  const diamondsCount = Math.floor(Math.random() * oddCount) * 2 + 1;

  return {
    diamondsCount,
    size,
  }
}