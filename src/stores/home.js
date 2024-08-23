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
      this.activeProjectName = projectName
      this.activeProjectYear = projectYear
    },
    clearActiveProjectData() {
      this.activeProjectName = null
      this.activeProjectYear = null
    },
  },
})