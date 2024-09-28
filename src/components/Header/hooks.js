import { useProcessStore } from "@/stores/process";
import { useProjectStore } from "@/stores/project";
import { useRouter } from "vue-router";
import { ROUTES, PAGE_NAMES } from "@/utils/constants";
import { handleRoute } from "@/utils/handleRoute";

export const useGetRightBtnClickHandler = (pageNameRef) => {
  const projectStore = useProjectStore();
  const processStore = useProcessStore();
  const router = useRouter();

  const clickHandler = () => {
    const pageName = pageNameRef.value
    if (pageName == PAGE_NAMES.project) {
      if (projectStore.isInfoOpen) {
        projectStore.closeProjectInfo();
      } else {
        handleRoute(router, ROUTES.home);
      }
    } else if (pageName == PAGE_NAMES.me) {
      handleRoute(router, ROUTES.home);
    } else if (pageName == PAGE_NAMES.process) {
      if (processStore.popupData.isOpen) {
        processStore.closePopup();
      } else {
        handleRoute(router, ROUTES.home);
      }
    }
  }

  return clickHandler
};

export const useGetLeftBtnClickHandler = (pageNameRef) => {
  const projectStore = useProjectStore();

  const clickHandler = () => {
    const pageName = pageNameRef.value
  
    if (pageName == PAGE_NAMES.project) {
      projectStore.openProjectInfo();
    }
  }

  return clickHandler
};