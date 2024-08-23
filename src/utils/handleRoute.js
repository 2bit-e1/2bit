/**
 * @param {import('vue-router').Router} router
 * @param {string} path
 * @returns {void}
 */
export const handleRoute = (router, path) => {
  router.push(path)
  // if (document.startViewTransition) {
  //   document.startViewTransition(() => {
  //   })
  // } else {
  //   router.push(path)
  // }
}