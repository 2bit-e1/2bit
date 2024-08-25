import { PAGE_NAMES } from "@/utils/constants"
import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
  state: () => ({
    activeProjectName: null,
    activeProjectYear: null,
  }),
  actions: {
    /** @param {string} projectName @param {number} projectYear */
    setActiveProjectData(projectName, projectYear) {
      console.log("setActiveProjectData store");
      
      this.activeProjectName = projectName
      this.activeProjectYear = projectYear
    },
    clearActiveProjectData() {
      console.log("clearActiveProjectData store");
      this.activeProjectName = null
      this.activeProjectYear = null
    },
  },
})