import { defineStore } from "pinia"

export const useMediaPopupStore = defineStore('mediaPopup', {
  state: () => ({
    popupData: {
      isOpen: false,
      src: null,
      name: null,
      author: null,
      type: null, // 'video' | 'iframe'
    }
  }),
  actions: {
    /**
     * @param {string} src
     * @param {string} name
     * @param {string} author
     * @param {'video'|'iframe'} type
     */
    openPopup(src, name, author, type = 'video') {
      this.popupData.src = src
      this.popupData.name = name
      this.popupData.author = author
      this.popupData.type = type
      this.popupData.isOpen = true
    },
    closePopup() {
      this.popupData.isOpen = false
      this.popupData.src = null
      this.popupData.name = null
      this.popupData.author = null
      this.popupData.type = null
    },
  },
})
