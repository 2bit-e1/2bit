import { PAGE_NAMES } from "@/utils/constants"
import { defineStore } from "pinia"

export const useProjectStore = defineStore('project', {
  state: () => ({
    name: null,
    shrink: null,
    content: null,
    roles: [],
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
      this.name = projectData.name
      this.shrink = projectData.shrink
      this.content = projectData.content
      this.roles = projectData.roles
    },

    clearProjectData() {
      this.name = null
      this.shrink = null
      this.content = null
      this.roles = []
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