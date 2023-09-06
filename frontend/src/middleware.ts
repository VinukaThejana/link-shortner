import { defineMiddleware } from "astro/middleware"
import { getUser, isSessionValid } from "./utils/token";

export const onRequest = defineMiddleware(async ({ cookies, locals, redirect }, next) => {
  const session = cookies.get("session")
  if (!session || !session.value || !(await isSessionValid(session.value))) {
    return redirect('/something')
  }

  const user = getUser(session.value)
  if (!user) {
    return redirect('/something')
  }

  locals.user = user
  return next();
})
