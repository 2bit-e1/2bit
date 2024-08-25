<script setup>
</script>

<template>
  <a class="test" to="#">test</a>
</template>

<style scoped>
a.test {
  --border-delay: 300ms;
  transition: border 200ms var(--border-delay);
  border: 1px solid transparent;
  display: block;
  margin-top: 200px;
  width: 300px;
  height: 300px;
  padding: 10px;
  
}

.test:hover {
  --border-delay: 0ms;
  border: 1px solid #E0E0E0;
}
</style>