import { Link } from "@/types/link";
import { InfiniteData } from "@tanstack/react-query";

export const hasLinks = (
  data:
    | InfiniteData<{
        data: Link[];
        nextPage: number | null | undefined;
      }>
    | undefined,
): boolean => (data && data.pages[0].data.length !== 0 ? true : false);
