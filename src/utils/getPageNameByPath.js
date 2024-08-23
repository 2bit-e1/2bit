import { PAGE_NAMES, ROUTES } from "./constants"

export const getPageNameByPath = (path) => {
  if (path == ROUTES.home) return PAGE_NAMES.home
  if (path == ROUTES.process) return PAGE_NAMES.process
  if (path == ROUTES.me) return PAGE_NAMES.me
  if (path.includes("/projects")) return PAGE_NAMES.project
  return null
}