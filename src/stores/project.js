import { PAGE_NAMES } from "@/utils/constants"
import { defineStore } from "pinia"

export const useProjectStore = defineStore('project', {
  state: () => ({
    name: null,
    shrink: null,
    content: null,
    link: null,
    images: [],
    roles: [],
    isInfoOpen: false,
    footerData: {
      isVisible: window.innerWidth > 1024,
      currentImageInd: 0
    }
    // isFooterDataVisible: true
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
      this.images = projectData.images
      this.roles = projectData.roles
      this.link = projectData.link
    },

    clearProjectData() {
      this.name = null
      this.shrink = null
      this.link = null
      this.content = null
      this.images = []
      this.roles = []
      this.isInfoOpen = false
    },
    showFooterData() {
      this.footerData.isVisible = true
    },
    hideFooterData() {
      this.footerData.isVisible = false
    },
    setCurrentImage(ind) {
      this.footerData.currentImageInd = ind
    }
  },
})