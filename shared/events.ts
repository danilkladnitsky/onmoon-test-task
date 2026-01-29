import type { GameSession, GameSessionCell } from "./domain/game";

export const WEBSOCKET_EVENTS = {
  SERVER_ERROR: 'serverError',
  SERVER_SHUTDOWN: 'serverShutdown',
  CREATE_SESSION: 'createSession',
  SESSIONS_LIST: 'sessionsList',
  START_SESSION: 'startSession',
  JOIN_SESSION: 'joinSession',
  SESSION_JOINED: 'sessionJoined',
  LEAVE_SESSION: 'leaveSession',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_LEFT: 'playerLeft',
  OPEN_CELL: 'openCell',
  CELL_OPENED: 'cellOpened',
  CURRENT_PLAYER_ID: 'currentPlayerId',
  GAME_FINISHED: 'gameFinished',
} as const;

export interface IClientEmitPayload {
  [WEBSOCKET_EVENTS.CREATE_SESSION]: null;
  [WEBSOCKET_EVENTS.JOIN_SESSION]: { sessionId: string };
  [WEBSOCKET_EVENTS.LEAVE_SESSION]: null;
  [WEBSOCKET_EVENTS.OPEN_CELL]: { cellId: string };
}

export interface IServerEventPayload {
  [WEBSOCKET_EVENTS.PLAYER_LEFT]: { playerId: string };
  [WEBSOCKET_EVENTS.OPEN_CELL]: { openedCell: GameSessionCell, currentPlayerId: string };
  [WEBSOCKET_EVENTS.SESSIONS_LIST]: GameSession[];
  [WEBSOCKET_EVENTS.SESSION_JOINED]: { sessionId: string };
  [WEBSOCKET_EVENTS.CURRENT_PLAYER_ID]: string;
  [WEBSOCKET_EVENTS.START_SESSION]: { sessionId: string, currentPlayerId: string, diamondsCount: number, size: number };
  [WEBSOCKET_EVENTS.GAME_FINISHED]: { winnerId: string };
  [WEBSOCKET_EVENTS.SERVER_ERROR]: { error: string };
}

export type ClientEmitPayloadName = keyof IClientEmitPayload;

export type EventPayload<T> = {
  event: keyof typeof WEBSOCKET_EVENTS;
  payload: T;
};

export type JoinSessionEvent = {
  sessionId: string;
};

export type OpenCellEvent = {
  cellId: string;
};