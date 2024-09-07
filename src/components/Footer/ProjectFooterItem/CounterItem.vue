<script setup>
import AppearWord from '@/components/Appear/AppearWord.vue';

const {pagesCount} = defineProps({
  pagesCount: Number, 
  currentPage: Number, 
  delayOrder: Number,
  isActive: Boolean
})

</script>

<template>
  <div class="project-item project-item_counter">
    <div class="project-item-inner">
      <div class="project-counter-current-container">
        <AppearWord
          v-for="page in pagesCount"
          :word="('0' + page).slice(-2)"
          :isAppear="isActive && currentPage == page"
          :delayOrder="delayOrder"
          class="project-counter-current"
        />
      </div>
      
      &nbsp;
      <AppearWord
        :word="`/ ${('0' + pagesCount).slice(-2)}`"
        :isAppear="isActive"
        :delayOrder="1 + delayOrder"
        class="project-counter-total"
      />
    </div>
  </div>
</template>

<style>
.project-counter-current-container {
  position: relative;
}

.project-counter-current-container .project-counter-current {
  position: absolute;
  right: 1px;
}
</style>