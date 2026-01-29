import { getSocketConnection } from "@/socket"
import { useGameStore } from "@/stores/game.store"
import { generateGameGrid } from "@shared/domain/game"
import { WEBSOCKET_EVENTS, type IServerEventPayload } from "@shared/events"
import { onMounted, onUnmounted } from "vue"

export const useGameService = () => {
    const gameStore = useGameStore()

    const { emitEvent, socket } = getSocketConnection()

    const cleanupGameProgress = () => {
        gameStore.cleanupGameProgress()
    }

    // emit handlers
    const openCell = (cellId: string) => {
        if(gameStore.gameStatus !== 'in_progress' || !gameStore.isMyTurn) {
            return
        }

        emitEvent(WEBSOCKET_EVENTS.OPEN_CELL, {cellId})
    }

    // event listeners
    const onOpenCellEvent = (payload: IServerEventPayload['openCell']) => {
        gameStore.setNextPlayerId(payload.currentPlayerId)
        gameStore.updateGameGrid(payload.openedCell)
    }

    const onGameStartEvent = (payload: IServerEventPayload['startSession']) => {
        gameStore.setGameStatus('in_progress')
        gameStore.setNextPlayerId(payload.currentPlayerId)
        gameStore.setGameGrid(generateGameGrid(payload.size))
        gameStore.setDiamondsCount(payload.diamondsCount)
    }

    const onCurrentPlayerIdEvent = (payload: IServerEventPayload['currentPlayerId']) => {
        gameStore.setCurrentPlayerId(payload)
    }

    const onGameFinishedEvent = (payload: IServerEventPayload['gameFinished']) => {
        gameStore.setGameStatus('finished')
        gameStore.setWinnerPlayerId(payload.winnerId)
    }

    const onPlayerLeftEvent = (payload: IServerEventPayload['playerLeft']) => {
        gameStore.setGameStatus('finished')
        gameStore.setWinnerPlayerId(gameStore.currentPlayerId)
    }

    onMounted(() => {
        socket.on(WEBSOCKET_EVENTS.CELL_OPENED, onOpenCellEvent)
        socket.on(WEBSOCKET_EVENTS.CURRENT_PLAYER_ID, onCurrentPlayerIdEvent)
        socket.on(WEBSOCKET_EVENTS.START_SESSION, onGameStartEvent)
        socket.on(WEBSOCKET_EVENTS.GAME_FINISHED, onGameFinishedEvent)
        socket.on(WEBSOCKET_EVENTS.PLAYER_LEFT, onPlayerLeftEvent)
    })

    onUnmounted(() => {
        socket.off(WEBSOCKET_EVENTS.CELL_OPENED, onOpenCellEvent)
        socket.off(WEBSOCKET_EVENTS.CURRENT_PLAYER_ID, onCurrentPlayerIdEvent)
        socket.off(WEBSOCKET_EVENTS.START_SESSION, onGameStartEvent)
        socket.off(WEBSOCKET_EVENTS.GAME_FINISHED, onGameFinishedEvent)
        socket.off(WEBSOCKET_EVENTS.PLAYER_LEFT, onPlayerLeftEvent)
    })

    return {
        openCell, cleanupGameProgress
    }
}