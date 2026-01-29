import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Player } from '@shared/domain/player'
import { decodeCellId, generateGameGrid, type GameSession, type GameSessionCell, type GameSessionStatus,  } from '@shared/domain/game'

export const useAppStore = defineStore('app', () => {
    const currentSessionId = ref<string | null>(null)
    const roomsList = ref<GameSession[]>([])
    const roomPlayers = ref<Player[]>([])
    const roomStatus = ref<GameSessionStatus>('waiting')
    const currentPlayerId = ref<string | null>(null)

    const setCurrentPlayerId = (playerId: string | null) => {
        currentPlayerId.value = playerId
    }

    const setCurrentSessionId = (sessionId: string | null) => {
        currentSessionId.value = sessionId
    }

    const setRoomPlayers = (players: Player[]) => {
        roomPlayers.value = players
    }

    const setRoomStatus = (status: GameSessionStatus) => {
        roomStatus.value = status
    }

    const setRooms = (rooms: GameSession[]) => {
        roomsList.value = rooms
    }

    const gameGrid = ref<GameSessionCell[][]>(generateGameGrid(6))

    const setGameGrid = (grid: GameSessionCell[][]) => {
        gameGrid.value = grid
    }

    const resetGameGrid = () => {
        setGameGrid(generateGameGrid(6))
    }

    const openCell = (cell: GameSessionCell) => {
        const [x, y] = decodeCellId(cell.id)
        const originalCell = gameGrid.value[x][y]

        if (!originalCell) {
            throw new Error('Cell not found')
        }

        gameGrid.value[x][y] = {
            ...originalCell,
            ...cell
        }
    }
  
    return {
        currentSessionId, roomPlayers, roomStatus, roomsList, gameGrid, currentPlayerId
        ,setCurrentSessionId, setRoomPlayers, setRoomStatus, setRooms
        ,setGameGrid, openCell, resetGameGrid, setCurrentPlayerId
    }
})
