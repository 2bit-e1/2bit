<script setup>
import AppearWord from "@/components/Appear/AppearWord.vue";
import AppearWords from "@/components/Appear/AppearWords.vue";
import { computed } from "vue";

defineEmits(["listMouseEnter", "listMouseLeave"]);

const props = defineProps({
  isActive: Boolean,
  isListLinks: Boolean,
  isPressList: Boolean,
  isItemsActive: Boolean,
  labelDelayOrder: Number,
  itemsDelayOrder: Number,
  label: String,
  list: Array,
});

const itemsDelayOrder = computed(
  () => props.itemsDelayOrder || props.labelDelayOrder + 1
);
</script>

<template>
  <AppearWord
    :word="label"
    :isAppear="isActive"
    :delayOrder="labelDelayOrder"
    class="me-list-title"
    v-bind="$attrs"
  />

  <ul
    class="me-list"
    @mouseenter="$emit('listMouseEnter')"
    @mouseleave="$emit('listMouseLeave')"
  >
    <li v-for="(item, ind) in list" class="me-list-item" :key="ind">
      <a
        v-if="isListLinks"
        class="me-list-item-link"
        :class="isItemsActive && 'hoverable hoverable-from-black'"
        :href="item.link"
        :tabindex="isItemsActive ? 0 : -1"
        :style="{ pointerEvents: isItemsActive ? '' : 'none' }"
      >
        <AppearWords
          :text="item.text"
          :isAppear="isItemsActive"
          :delayOrder="itemsDelayOrder + ind"
        />
      </a>
      <AppearWords
        v-else
        :text="item"
        :isAppear="isItemsActive"
        :delayOrder="itemsDelayOrder + ind"
      />
    </li>
  </ul>
</template>

<style scoped>
.me-list-title {
  flex-shrink: 0;
  color: var(--clr-gray);
}

.me-list {
  align-content: start;
  display: flex;
  flex-wrap: wrap;
  column-gap: 15px;
  min-height: 31px;
  height: 100%;
  max-height: 35px;
  overflow: hidden;
}

.me-list-item:first-child {
  padding-left: 20px;
}

@media (max-width: 820px) {
}
</style>
