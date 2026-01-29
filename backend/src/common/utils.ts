import { Socket } from 'socket.io';

export const getSessionIdFromClient = (client: Socket) => {
  // first room is the client id, second is the session id
  const rooms = Array.from(client.rooms);

  if (rooms.length < 2) {
    return null;
  }

  return rooms[1];
};
