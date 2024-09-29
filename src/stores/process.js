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
   */
    openPopup(src, description) {
      this.popupData.imageInfo = { src, description };
      this.popupData.isOpen = true;
    },
    closePopup() {
      this.popupData.isOpen = false;
    },
  },
})