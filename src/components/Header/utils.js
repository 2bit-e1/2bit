import { PAGE_NAMES } from "@/utils/constants";

export const getRightBtnRole = (pageName, isProjectInfoOpen, isProcessPopupOpen) => {
  if (pageName == PAGE_NAMES.project) {
    return isProjectInfoOpen ? "button" : "link";
  } else if (pageName == PAGE_NAMES.me) {
    return "link";
  } else if (pageName == PAGE_NAMES.process) {
    return isProcessPopupOpen ? "button" : "link";
  } else {
    return "presentation";
  }
}

export const getLeftBtnRole = (pageName) => {
  if (pageName != PAGE_NAMES.project) return "presentation";
  else return "button";
}

export const getHeaderExtraClass = (pageName) => ({
  header_home: pageName == PAGE_NAMES.home,
  header_project: pageName == PAGE_NAMES.project,
  header_me: pageName == PAGE_NAMES.me,
  header_info: pageName == PAGE_NAMES.info,
})