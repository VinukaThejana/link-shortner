import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getBackendURL } from './utils/path';
import { verifySession } from './utils/token';
import { pscale } from './config/db';

const ignore = (path: string): boolean => {
  const paths = [
    "/favicon.ico"
  ];

  return paths.includes(path)
}
 
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  if (url === "/" || url === "/home") {
    const cookie = request.cookies.get("session");
    if (cookie) {
      const session = cookie.value;
      if (session) {
        if (await verifySession(session)) {
          return NextResponse.next()
        }
      }
    }

    return NextResponse.redirect(getBackendURL("/auth/login"))
  }

  if (ignore(url)) {
    return NextResponse.next()
  }

  const data = url.split("/")
  if (data.length !== 2) return NextResponse.next()
  const key = data[1];

  try {
    const result = (await pscale.execute("select url from links where `key`=?", [key])) as unknown as {
      rows: {
        url: string
      }[];
       rowsAffected: number;
      insertId: string;
      size: number;
      statement: string;
      time: number
    }
    if (result.rows.length !== 1) {
      return NextResponse.redirect("/")
    }

    return NextResponse.redirect(result.rows[0].url)
  } catch (error) {
    console.error(error)
    return NextResponse.redirect("/")
  }
}
 
export const config = {
  matcher: '/:path*',
}
