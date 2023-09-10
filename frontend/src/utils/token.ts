import { User } from "@/types/session";
import * as jose from "jose";

export async function verifySession(token: string): Promise<boolean> {
  try {
    const alg = "HS256"
    const key = new TextEncoder().encode(process.env.SESSION_TOKEN_SECRET)

    try {
      const { payload } = await jose.jwtVerify(token, key, {
        algorithms: [alg]
      })
      if (!payload.exp) {
        return false
      }

      const now = Math.floor(new Date().getTime()/1000)
      if (now >= payload.exp) {
        return false
      }

      return true
    } catch (error) {
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getUser(token: string): Promise<User | null> {
  try {
    if (!(await verifySession(token))) {
      return null
    }

    const data = jose.decodeJwt(token) as User
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
