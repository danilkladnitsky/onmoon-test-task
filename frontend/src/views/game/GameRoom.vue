<script setup lang="ts">
import router from '@/router'
import GameStatus from './sub/GameStatus.vue'
import { useSessionService } from '@/services/session.service'
import GameGrid from './sub/GameGrid.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/session.store'
import { useGameService } from '@/services/game.service'
import { useGameStore } from '@/stores/game.store'

const sessionStore = useSessionStore()
const gameStore = useGameStore()

const { leaveSession, joinSession } = useSessionService()
const { openCell, cleanupGameProgress } = useGameService()

const urlId = useRoute().params.id

const handleLeaveSession = () => {
  leaveSession()
  cleanupGameProgress()
  router.push('/')
}

onMounted(() => {
  if (!sessionStore.currentSessionId && typeof urlId === 'string') {
   joinSession(urlId)
  }
})

</script>

<template>
  <main>
    <header>
      <GameStatus />
    </header>
    <section>
      <GameGrid :openCell="openCell" :gameGrid="gameStore.gameGrid" :isMyTurn="gameStore.isMyTurn" />
    </section>
    <button @click="handleLeaveSession">Leave session</button>
  </main>
</template>

<style scoped>
header {
  position: fixed;
  bottom: 2rem;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

section {
  margin-bottom: 1rem;
}

</style>