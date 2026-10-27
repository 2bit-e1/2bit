import { PAGE_NAMES } from "@/utils/constants"
import { defineStore } from "pinia"

export const useProjectStore = defineStore('project', {
  state: () => ({
    name: null,
    slug: null,
    navigationDirection: 1,
    shrink: null,
    content: null,
    link: null,
    images: [],
    roles: [],
    year: null, 
    isInfoOpen: false,
    isGalleryReady: false,
    isPreparingMedia: false,
    isLeavingProject: false,
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
      this.slug = projectData.slug
      this.name = projectData.name
      this.shrink = projectData.shrink
      this.content = projectData.content
      this.images = projectData.images
      this.roles = projectData.roles
      this.year    = projectData.year
      this.link = projectData.link
    },

    clearProjectData() {
      this.name = null
      this.slug = null
      this.shrink = null
      this.link = null
      this.content = null
      this.images = []
      this.roles = []
      this.year    = null
      this.isInfoOpen = false
      this.isGalleryReady = false
      this.isPreparingMedia = false
      this.isLeavingProject = false
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
