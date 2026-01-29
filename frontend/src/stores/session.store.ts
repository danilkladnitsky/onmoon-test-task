import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { GameSession } from '@shared/domain/game'

export const useSessionStore = defineStore('session', () => {
    const currentSessionId = ref<string | null>(null)
    const gameSessions = ref<GameSession[]>([])

    const setCurrentSessionId = (sessionId: string | null) => {
        currentSessionId.value = sessionId
    }

    const setGameSessions = (sessions: GameSession[]) => {
        gameSessions.value = sessions
    }

    return {
        currentSessionId, gameSessions, setCurrentSessionId, setGameSessions
    }
})
