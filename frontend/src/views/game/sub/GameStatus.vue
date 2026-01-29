<script setup lang="ts">
import { useGameStore } from '@/stores/game.store';
import { useSessionStore } from '@/stores/session.store';
import { computed } from 'vue';

const gameStore = useGameStore()
const sessionStore = useSessionStore()

const gameStatusText = computed(() => {
    return {
        'waiting': 'Waiting for players',
        'in_progress': 'Game in progress',
        'finished': 'Game finished'
    }[gameStore.gameStatus]
})

</script>

<template>
  <div>
    <p>Diamonds count: {{ gameStore.diamondsCount }}</p>
    <p>Is my turn: {{ gameStore.isMyTurn }}</p>
    <p>Game Status: {{ gameStatusText }}</p>
    <p>Session ID: {{ sessionStore.currentSessionId }}</p>
    <p>My player ID: {{ gameStore.currentPlayerId }}</p>
    <p>Winner player ID: {{ gameStore.winnerPlayerId }}</p>
  </div>
</template>
