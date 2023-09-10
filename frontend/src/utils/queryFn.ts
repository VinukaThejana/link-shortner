import { getBackendPath } from "./path"

export const LIMIT = 5;

export const getLinks = async (page: number): Promise<{
  data: Link[],
  nextPage: number | null | undefined
}> => {
  const res = await fetch(getBackendPath("/links", [`page=${page}`, `limit=${LIMIT}`]), {
    headers: {
      "Content-Type": "application/json"
    },
    method: "GET",
    credentials: "include",
  })
  if (res.status !== 200) {
    return {
      data: [],
      nextPage: page
    }
  }

  const data = await res.json() as {
    data: Link[];
    nextPage: number | null | undefined
  }

  const { data: links, nextPage } = data
  return {
    data: links,
    nextPage
  }
}

export const deleteLink = async (key: string): Promise<"success" | "fail"> => {
  const res = await fetch(getBackendPath("/links/delete"), {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      "key": key
    })
  })

  if (res.status !== 200) {
    return "fail"
  }

  return "success"
}
