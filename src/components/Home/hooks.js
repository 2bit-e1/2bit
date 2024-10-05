import { onMounted, onBeforeUnmount } from "vue";

export const useMobileProjectItemListeners = (
  projectEl,
  setActiveProjectData,
  clearActiveProjectData
) => {
  const isMobile = window.innerWidth <= 1024;

  const handleClick = (event) => {
    if (!isMobile) return;

    event.stopPropagation();
    event.preventDefault();
    setActiveProjectData();
  };

  const clickOutsideListener = (event) => {
    const el = projectEl.value;
    if (!el || el === event.target || event.composedPath().includes(el)) {
      clearActiveProjectData();
    }
  };

  onMounted(() => {
    if (!isMobile) return;

    document.addEventListener("click", clickOutsideListener);
  });

  onBeforeUnmount(() => {
    if (!isMobile) return;

    document.removeEventListener("click", clickOutsideListener);
  });

  return {
    handleClick,
  };
};
