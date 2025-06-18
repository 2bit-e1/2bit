<script setup>
import { onMounted, ref, watchEffect } from "vue";
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
  await import('@/components/Preloader.vue')
  await router.isReady();
  isRouterReady.value = true;
});

watchEffect(() => {
  if (isRouterReady.value) {
    pageName.value = getPageNameByPath(route.path);

    if (pageName.value === PAGE_NAMES.home) {
      // Отключение скролла      
      document.body.classList.add("no-scroll"); // Для Android
      document.body.style.position = "fixed"; // Для iOS
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Включение скролла для остальных страниц
      document.body.classList.remove("no-scroll"); // Для Android
      document.body.style.position = ""; // Для iOS
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
  overflow: hidden; /* Отключение прокрутки для Android */
}

html,
body {
  overscroll-behavior: none; /* Убирает эффекты прокрутки */
}

body.no-scroll {
  touch-action: none; /* Отключение жестов прокрутки для Android/iOS */
}
</style>
