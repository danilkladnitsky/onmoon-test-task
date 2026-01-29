import { decodeCellId, type GameSessionCell, type GameSessionStatus } from "@shared/domain/game"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useGameStore = defineStore('game', () => {
    const gameGrid = ref<GameSessionCell[][]>([])
    const diamondsCount = ref<number>(0)

    // current session player
    const currentPlayerId = ref<string | null>(null)
    // player who is making a move right now
    const nextPlayerId = ref<string | null>(null)
    // player who won the game
    const winnerPlayerId = ref<string | null>(null)

    const gameStatus = ref<GameSessionStatus>('waiting')

    const setWinnerPlayerId = (playerId: string | null) => {
        winnerPlayerId.value = playerId
    }

    const cleanupGameProgress = () => {
        nextPlayerId.value = null
        winnerPlayerId.value = null
        gameStatus.value = 'waiting'
        gameGrid.value = []
    }

    const setGameGrid = (grid: GameSessionCell[][]) => {
        gameGrid.value = grid
    }

    const setDiamondsCount = (count: number) => {
        diamondsCount.value = count
    }

    const updateGameGrid = (cell: GameSessionCell) => {
        const [x, y] = decodeCellId(cell.id)

        if (gameGrid.value[x]) {
            gameGrid.value[x][y] = cell
        }
    }

    const isMyTurn = computed(() => currentPlayerId.value === nextPlayerId.value && gameStatus.value === 'in_progress')

    const setCurrentPlayerId = (playerId: string | null) => {
        currentPlayerId.value = playerId
    }

    const setNextPlayerId = (playerId: string | null) => {
        nextPlayerId.value = playerId
    }

    const setGameStatus = (status: GameSessionStatus) => {
        gameStatus.value = status
    }

    return {
        gameGrid, currentPlayerId, setCurrentPlayerId
        ,nextPlayerId, setNextPlayerId, updateGameGrid, setGameGrid
        ,gameStatus, setGameStatus, isMyTurn
        ,winnerPlayerId, setWinnerPlayerId, cleanupGameProgress, setDiamondsCount, diamondsCount
    }
})