<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { getPageNameByPath } from "./utils/getPageNameByPath";
import Header from "./components/Header/Header.vue";
import Footer from "./components/Footer/Footer.vue";
import { PAGE_NAMES } from "./utils/constants";

const router = useRouter();
const route = useRoute();

const isRouterReady = ref(false);
const pageName = ref(null);
const scrollPosition = ref(0); // Храним текущую позицию прокрутки

onMounted(async () => {
  await router.isReady();
  isRouterReady.value = true;
});

watchEffect(() => {
  if (isRouterReady.value) {
    pageName.value = getPageNameByPath(route.path);

    // Отключение скролла на iOS
    if (pageName.value === PAGE_NAMES.home) {
      scrollPosition.value = window.scrollY; // Запоминаем текущую позицию
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition.value}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Возвращаем скролл
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollPosition.value); // Возвращаем пользователя на прежнюю позицию
    }
  }
});
</script>

<template>
  <header>
    <Header :pageName="pageName" />
  </header>
  <main
    class="main"
    :class="{
      'main_me': pageName == PAGE_NAMES.me,
    }"
  >
    <RouterView :pageName="pageName" />
  </main>
  <footer>
    <Footer :pageName="pageName" />
  </footer>
</template>

<style>
/* Общие стили */
body.no-scroll {
  overflow: hidden; /* Отключает прокрутку */
}

/* iOS-совместимость */
html,
body {
  touch-action: none; /* Отключает жесты прокрутки */
  overscroll-behavior: none; /* Убирает эффекты прокрутки */
}
</style>
