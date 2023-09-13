import { User } from "@/types/session";
import * as jose from "jose";
import { getCookie } from "./utils";

export async function verifySession(token: string): Promise<boolean> {
  try {
    const alg = "HS256";
    const key = new TextEncoder().encode(process.env.SESSION_TOKEN_SECRET);

    try {
      const { payload } = await jose.jwtVerify(token, key, {
        algorithms: [alg],
      });
      if (!payload.exp) {
        return false;
      }

      const now = Math.floor(new Date().getTime() / 1000);
      if (now >= payload.exp) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getUser(token: string): Promise<User | null> {
  try {
    if (!(await verifySession(token))) {
      return null;
    }

    const data = jose.decodeJwt(token) as User;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type AccessToken = {
  iat: number;
  exp: number;
  nbf: number;
  sub: number;
  token_uuid: string;
};

export const getAccessToken = (): AccessToken | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = getCookie("access_token");
  if (!accessToken) {
    return null;
  }

  const payload = <AccessToken | undefined>(
    (<unknown>jose.decodeJwt(accessToken))
  );
  if (!payload) {
    return null;
  }

  return payload;
};
