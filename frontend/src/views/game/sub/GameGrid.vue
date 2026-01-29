<script setup lang="ts">
import type { GameSessionCell } from '@shared/domain/game';

const props = defineProps<{
  gameGrid: GameSessionCell[][]
  isMyTurn: boolean
  openCell: (cellId: string) => void
}>()

</script>

<template>
  <div>
    <div v-for="(row, indexX) in props.gameGrid" v-bind:key="indexX" class="column">
    <div v-for="(cell) in row" v-bind:key="cell.id" class="row">
      <div class="cell" :class="{ 'cell-opened': cell.opened, 'cell-disabled': !props.isMyTurn }" @click="props.openCell(cell.id)">
        <!-- if opened and has no diamond, show nearest diamonds count -->
        <div v-if="cell.opened && !cell.hasDiamond" class="cell-content">
          {{ cell.nearestDiamondsCount }}
        </div>
        <!-- if opened and has diamond, show diamond -->
        <div v-else-if="cell.opened && cell.hasDiamond" class="cell-content">
            💎
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.column {
  display: flex;
}

.row {
  display: flex;
}

.cell {
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }

}

.cell-content {
  font-size: 12px;
  text-align: center;
  line-height: 30px;
}

.cell-disabled {
  cursor: not-allowed;
}
</style>