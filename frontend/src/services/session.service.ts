import { appConfig } from "@/config"
import { getSocketConnection } from "@/socket"
import { useSessionStore } from "@/stores/session.store"
import { generateRandomSessionSettings } from "@shared/domain/game"
import { WEBSOCKET_EVENTS, type IServerEventPayload } from "@shared/events"
import { onMounted, onUnmounted } from "vue"

export const useSessionService = () => {
    const sessionStore = useSessionStore()

    const {emitEvent, socket} = getSocketConnection()

    // emit handlers
    const createSession = () => {
        // TODO: implement ui for session settings
        const sessionSettings = generateRandomSessionSettings()

        fetch(`${appConfig.backendUrl}/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sessionSettings)
        })
    }

    const joinSession = (sessionId: string) => {
        sessionStore.setCurrentSessionId(sessionId)
        emitEvent(WEBSOCKET_EVENTS.JOIN_SESSION, {sessionId})
    }

    const leaveSession = () => {
        sessionStore.setCurrentSessionId(null)
        emitEvent(WEBSOCKET_EVENTS.LEAVE_SESSION, null)
    }

    // event listeners
    const onSessionListEvent = (sessions: IServerEventPayload['sessionsList']) => {
        sessionStore.setGameSessions(sessions)
    }

    onMounted(() => {
        socket.on(WEBSOCKET_EVENTS.SESSIONS_LIST, onSessionListEvent)
        // TODO: handle server shutdown event
        socket.on(WEBSOCKET_EVENTS.SERVER_SHUTDOWN, console.log)
    })

    onUnmounted(() => {
        socket.off(WEBSOCKET_EVENTS.SESSIONS_LIST, onSessionListEvent)
        socket.off(WEBSOCKET_EVENTS.SERVER_SHUTDOWN, console.log)
    })

    return {
        createSession, joinSession, leaveSession
    }
}