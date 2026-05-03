import { deleteCookie } from "cookies-next"

export const logout = () => {
  deleteCookie("access_token")
  deleteCookie("refresh_token")
  window.location.href = "/login"
}