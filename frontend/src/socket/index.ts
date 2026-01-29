import { appConfig } from '@/config'
import { WEBSOCKET_EVENTS, type ClientEmitPayloadName, type IClientEmitPayload } from '@shared/events'
import { prepareEventPayload } from '@shared/utils/prepareEventPayload'
import { io, Socket } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'

let socket: Socket | null = null

export function getSocketConnection() {
  if (!socket) {
    socket = io(appConfig.socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })
  }

  const onSocketError = (error: unknown) => {
    // TODO: handle different types of errors, implement toast notification, recovery or smh like that
    console.log('Socket error:', error)
  }

  const emitEvent = <E extends ClientEmitPayloadName>(event: E, payload: IClientEmitPayload[E]) => {
    socket?.emit(event, prepareEventPayload(event, payload))
  }

   onMounted(() => {
    socket?.on(WEBSOCKET_EVENTS.SERVER_ERROR, onSocketError)
  })

  onUnmounted(() => {
    socket?.off(WEBSOCKET_EVENTS.SERVER_ERROR, onSocketError)
  })

  return { emitEvent, socket }
}