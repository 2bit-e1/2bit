import { PAGE_NAMES } from "@/utils/constants"
import { defineStore } from "pinia"

export const useProjectStore = defineStore('project', {
  state: () => ({
    projectName: null,
    projectShrink: null,
    projectContent: null,
    isInfoOpen: false,
    isFooterDataVisible: true
  }),
  getters: {
  },
  actions: {
    openProjectInfo() {
      this.isInfoOpen = true
    },
    closeProjectInfo() {
      this.isInfoOpen = false
    },

    /** @type {name: string, shrink: boolean, content: string} */
    setProjectData(projectData) {
      this.projectName = projectData.name
      this.projectShrink = projectData.shrink
      this.projectContent = projectData.content
    },

    clearProjectData() {
      this.projectName = null
      this.projectShrink = null
      this.projectContent = null
      this.isInfoOpen = false
    },
    showFooterData() {
      this.isFooterDataVisible = true
    },
    hideFooterData() {
      this.isFooterDataVisible = false
    }
  },
})