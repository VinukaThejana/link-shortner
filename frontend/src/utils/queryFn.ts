import { Link } from "@/types/link";
import { getBackendURL } from "./path";
import { Inter_Tight } from "next/font/google";

export const PAGINATION_LIMIT = 5;

export async function getLinks(page: number): Promise<{
  data: Link[];
  nextPage: number | null | undefined;
}> {
  const res = await fetch(
    getBackendURL("/links", [
      {
        key: "page",
        value: page,
      },
      {
        key: "limit",
        value: PAGINATION_LIMIT,
      },
    ]),
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    },
  );

  if (res.status !== 200) {
    console.error(await res.json());
    return {
      data: [],
      nextPage: page,
    };
  }

  const data = (await res.json()) as {
    data: Link[];
    nextPage: number | null | undefined;
  };

  const { data: links, nextPage } = data;
  return {
    data: links,
    nextPage,
  };
}

export async function deleteUserLink(key: string): Promise<"success" | "fail"> {
  const res = await fetch(getBackendURL("/links/delete"), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      key: key,
    }),
  });

  if (res.status !== 200) {
    console.error(await res.json());
    return "fail";
  }

  return "success";
}

export async function updateLink(
  initialKey: string,
  newKey: string,
  url: string,
): Promise<"success" | "fail"> {
  const res = await fetch(getBackendURL("/links/update"), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      initial_key: initialKey,
      new_key: newKey,
      url: url,
    }),
  });

  if (res.status !== 200) {
    console.error(await res.json());
    return "fail";
  }

  return "success";
}

export async function updateLinkKey(
  initialKey: string,
  newKey: string,
): Promise<"success" | "fail"> {
  const res = await fetch(getBackendURL("/links/update/key"), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      initial_key: initialKey,
      new_key: newKey,
    }),
  });

  if (res.status !== 200) {
    console.error(await res.json());
    return "fail";
  }

  return "success";
}

export async function updateLinkURL(
  key: string,
  url: string,
): Promise<"success" | "fail"> {
  const res = await fetch(getBackendURL("/links/update/url"), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      key: key,
      url: url,
    }),
  });

  if (res.status !== 200) {
    console.error(await res.json());
    return "fail";
  }

  return "success";
}
