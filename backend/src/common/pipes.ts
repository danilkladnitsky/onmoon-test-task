import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EventPayload } from '@shared/events';

@Injectable()
export class PayloadPipe<T> implements PipeTransform<string, T> {
  transform(value: string): T {
    try {
      const { payload } = JSON.parse(value) as EventPayload<T>;

      return payload;
    } catch {
      throw new BadRequestException('Invalid WebSocket payload JSON');
    }
  }
}
