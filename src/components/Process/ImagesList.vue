<script setup>
const emits = defineEmits(['openPopup']);

const images = [
  "https://images.unsplash.com/photo-1602850152657-3bd1351c7f15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1596025234111-57e5998b5035?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1589009602500-c5137f420e80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1560925562-8f504a92c529?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1587622129703-8029c13afe51?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1541261759512-c8295bae066e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1646569278930-8ef36259643d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1615663058598-ff4c0cc0f387?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1566794385556-233fc43d02a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1589009602500-c5137f420e80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1589009602500-c5137f420e80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1589009602376-95356e671add?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGRpZmZlcmVudCUyMHNpemVzfGVufDB8fDB8fHww",
];
</script>

<template>
  <div class="images-list">
    <div class="list-container">
      <ul class="list">
        <li class="list-item" v-for="image in images">
          <button class="item-image" @click.stop="$emit('openPopup')">
            <img :src="image" alt="" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.images-list {
  padding: var(--header-height) max(calc((100vw - 1440px) / 5), 26px);
}

.list-container {
}

.list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0px, 280px));
  justify-content: space-between;
  --row-gap: 80px;

  grid-auto-rows: 160px;
  column-gap: 50px;
  row-gap: var(--row-gap);
}

.list-item {
  display: flex;
  flex-direction: column;
}

.item-image {
  flex: 1 1 auto;
  height: auto;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

@media (max-width: 1024px) {
  .images-list {
    padding: 130px 0 40px;
  }
  
  .list {
    grid-template-columns: repeat(3, 1fr);
    --row-gap: 50px;
  }
}

@media (max-width: 820px) {
  .list {
    grid-auto-rows: 120px;
  }
}

@media (max-width: 600px) {
  .list {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 100px;
    --row-gap: 54px;
  }
}
</style>
