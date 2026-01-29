import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { WEBSOCKET_EVENTS } from '@shared/events';
import { Socket } from 'socket.io';

export class WebSocketExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    // TODO: handle different types of exceptions
    const error =
      exception instanceof Error ? exception.message : 'Unknown error';

    console.error(error);
    client.emit(WEBSOCKET_EVENTS.SERVER_ERROR, { error });
  }
}
