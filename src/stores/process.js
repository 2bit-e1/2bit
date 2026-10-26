import { defineStore } from "pinia"

export const useProcessStore = defineStore('process', {
  state: () => ({
    popupData: {
      isOpen: false,
      imageInfo: null
    }
  }),
  getters: {
  },
  actions: {
    /**
   * @param {string} src
   * @param {string} description
   * @param {'portrait' | 'landscape' | undefined} orientation
   * @param {number | undefined} index
   */
    openPopup(src, description, orientation, index) {
      this.popupData.imageInfo = { src, description, orientation, index };
      this.popupData.isOpen = true;
    },
    closePopup() {
      this.popupData.isOpen = false;
    },
  },
})
