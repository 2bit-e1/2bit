import { PAGE_NAMES } from "@/utils/constants"
import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
  state: () => ({
    activeProjectName: null,
    activeProjectYear: null,
    activeProjectLink: null,
  }),
  actions: {
    /** @param {string} projectName @param {number} projectYear */
    setActiveProjectData(projectName, projectYear, projectLink) {
      this.activeProjectName = projectName
      this.activeProjectYear = projectYear
      this.activeProjectLink = projectLink
    },
    clearActiveProjectData() {
      this.activeProjectName = null
      this.activeProjectYear = null
      this.activeProjectLink = null
    },
  },
})