<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router"
import { getPageNameByPath } from "./utils/getPageNameByPath";
import Header from "./components/Header.vue";
import Footer from "./components/Footer/Footer.vue";
import { PAGE_NAMES } from "./utils/constants";

const router = useRouter();
const route = useRoute()

const isRouterReady = ref(false)
const pageName = ref(null)

onMounted(async () => {
  await router.isReady()
  isRouterReady.value = true
})

watchEffect(() => {
  if (isRouterReady.value) pageName.value = getPageNameByPath(route.path)
})

</script>

<template>
  <header>
    <Header :pageName="pageName" />
  </header>
  <main class="main" :class="{ 'main_me': pageName == PAGE_NAMES.me }">
    <RouterView :pageName="pageName" />
  </main>
  <footer>
    <Footer :pageName="pageName" />
  </footer>
</template>

<style>
</style>