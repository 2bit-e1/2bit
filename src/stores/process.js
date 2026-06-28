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
   */
    openPopup(src, description, orientation) {
      this.popupData.imageInfo = { src, description, orientation };
      this.popupData.isOpen = true;
    },
    closePopup() {
      this.popupData.isOpen = false;
    },
  },
})
