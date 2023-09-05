import { decode } from "js-base64";
import * as jose from "jose";
import type { User } from "../types/session";

/**
* Function to check wether the access token is valid or not
*
* @returns true if valid else returns false
**/
export async function isAccessTokenValid(token: string): Promise<boolean> {
  try {
    const alg = 'RS256'
    const decodedPublicKey = decode(import.meta.env.ACCESS_TOKEN_PUBLIC_KEY)

    const publicKey = await jose.importSPKI(decodedPublicKey, alg)
    try {
      const { payload } = await jose.jwtVerify(token, publicKey)
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

/**
* Function to check wether the session token is valid
*
* @returns true if the session token is valid else returns false
**/
export async function isSessionValid(token: string): Promise<boolean> {
  try {
    const alg = "HS256"
    const key = new TextEncoder().encode(import.meta.env.SESSION_TOKEN_SECRET)

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

/**
* Get the content of the session without validating it
**/
export function getUser(token: string): User | null {
  try {
    const data = jose.decodeJwt(token) as User
    return data
  } catch (error) {
    return null
  }
}
