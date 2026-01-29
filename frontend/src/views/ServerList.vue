<script setup lang="ts">
import router from '@/router';
import { useSessionService } from '@/services/session.service';
import { useSessionStore } from '@/stores/session.store';

const { createSession, joinSession } = useSessionService()
const sessionStore = useSessionStore()

const onJoinSession = (sessionId: string) => {
  // TODO: add confirmation that session is not full
  joinSession(sessionId)
  router.push(`/game/${sessionId}`)
}

</script>

<template>
  <main class="server-list">
    <h1>Server List</h1>
    <section class="servers">
      <div
        v-for="session in sessionStore.gameSessions"
        :key="session.id"
        class="server-item"
        @click="onJoinSession(session.id)"
      >
        <span class="server-id">{{ session.id }}</span>
        <span class="server-status">Waiting for players</span>
      </div>
    </section>
    <button @click="createSession">Create Game Session</button>
  </main>
</template>

<style scoped>
.server-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.servers {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.server-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.server-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.server-id {
  font-weight: 500;
  color: #333;
}

.server-status {
  font-size: 0.875rem;
  color: #28a745;
}
</style>