import { defineMiddleware } from "astro/middleware"
import { getUser, isSessionValid } from "./utils/token";

const homeRoute = "/home";

export const onRequest = defineMiddleware(async ({ cookies, locals, url, redirect }, next) => {
  const session = cookies.get("session")
  if (url.pathname === "/") {
    if (!session || !session.value || !(await isSessionValid(session.value))) {
      return redirect(homeRoute)
    }

    const user = getUser(session.value)
    if (!user) {
      return redirect(homeRoute)
    }

    locals.user = user
  }

  if (!session || !session.value || !(await isSessionValid(session.value))) {
    locals.user = null
  } else {
    locals.user = getUser(session.value)
  }

  return next();
})
