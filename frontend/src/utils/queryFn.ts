import { Link } from "@/types/link";
import { getBackendURL } from "./path";
import { Fetch } from "./token";

export const PAGINATION_LIMIT = 5;

export async function getLinks(page: number): Promise<{
  data: Link[];
  nextPage: number | null | undefined;
}> {
  const res = await Fetch(
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
  );

  if (res.status !== 200) {
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
  const res = await Fetch(getBackendURL("/links/delete"), {
    method: "POST",
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
  const res = await Fetch(getBackendURL("/links/update"), {
    method: "POST",
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
  const res = await Fetch(getBackendURL("/links/update/key"), {
    method: "POST",
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
  const res = await Fetch(getBackendURL("/links/update/url"), {
    method: "POST",
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

export async function isKeyAvailable(
  key: string,
): Promise<"available" | "invalid" | "not available"> {
  const res = await fetch(getBackendURL("/check/links/key"), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      key: key,
    }),
  });

  if (res.status !== 200) {
    console.error(await res.json());
    return "invalid";
  }

  const data = (await res.json()) as {
    available: boolean;
  };

  return data.available ? "available" : "not available";
}

export async function createLink(
  url: string,
  key?: string,
): Promise<"success" | "fail"> {
  const res = await Fetch(getBackendURL("/links/new"), {
    method: "POST",
    body: JSON.stringify({
      link: url,
      key: key,
    }),
  });

  if (res.status !== 200) {
    return "fail";
  }

  return "success";
}
