import { getBackendPath } from "./path"

export const getLinks = async (page: number): Promise<{
  data: Link[],
  nextPage: number | null | undefined
}> => {
  const limit = 2
  const res = await fetch(getBackendPath("/links", [`page=${page}`, `limit=${limit}`]), {
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
