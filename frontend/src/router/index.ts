import { createRouter, createWebHistory } from 'vue-router'
import ServerList from '@/views/ServerList.vue'
import GameRoom from '@/views/game/GameRoom.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ServerList,
    },
    {
      path: '/game/:id',
      name: 'game',
      component: GameRoom,
    },
  ],
})

export default router
