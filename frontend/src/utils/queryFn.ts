import { Link } from "@/types/link";
import { getBackendURL } from "./path";

export const PAGINATION_LIMIT = 5;

export async function getLinks(page: number): Promise<{
  data: Link[],
  nextPage: number | null | undefined
}> {
  const res = await fetch(
    getBackendURL("/links", [
      {
        key: "page",
        value: page
      },
      {
        key: "limit",
        value: PAGINATION_LIMIT
      }
    ]), {
      headers: {
        "Content-Type": "application/json"
      },
      method: "GET",
      credentials: "include"
    }
  )

  if (res.status !== 200) {
    console.error(await res.json())
    return {
      data: [],
      nextPage: page
    }
  }

  const data = await res.json() as {
    data: Link[],
    nextPage: number | null | undefined
  }

  const { data: links, nextPage } = data
  return {
    data: links,
    nextPage
  }
}


export async function deleteUserLink(key: string): Promise<"success" | "fail"> {
  const res = await fetch(
    getBackendURL("/links/delete"), {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        "key": key
      })
    }
  )

  if (res.status !== 200) {
    console.error(await res.json())
    return "fail"
  }

  return "success"
}
