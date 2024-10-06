import { defineStore } from "pinia"

export const useMediaPopupStore = defineStore('mediaPopup', {
  state: () => ({
    popupData: {
      isOpen: false,
      src: null,
      name: null,
      author: null,
    }
  }),
  getters: {
  },
  actions: {
    /**
   * @param {string} src
   * @param {string} name
   * @param {string} author
   */
    openPopup(src, name, author) {
      this.popupData.src = src;
      this.popupData.name = name;
      this.popupData.author = author;
      this.popupData.isOpen = true;
    },
    closePopup() {
      // this.popupData.src = null;
      this.popupData.name = null;
      this.popupData.author = null;
      this.popupData.isOpen = null;
    },
  },
})