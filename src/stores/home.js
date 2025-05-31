import { PAGE_NAMES } from "@/utils/constants"
import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
  state: () => ({
    activeProjectName: null,
    activeProjectYear: null,
    activeProjectLink: null,
    activeProjectImage: null, // <---- новое
  }),
  actions: {
    setActiveProjectData(name, year, link, image = null) {
      this.activeProjectName = name;
      this.activeProjectYear = year;
      this.activeProjectLink = link;
      this.activeProjectImage = image;
    },
    clearActiveProjectData() {
      this.activeProjectName = null;
      this.activeProjectYear = null;
      this.activeProjectLink = null;
      this.activeProjectImage = null;
    },
  },
})