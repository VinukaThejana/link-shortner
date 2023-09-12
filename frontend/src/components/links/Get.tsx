"use client";

import { Link } from "@/types/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  deleteUserLink,
  getLinks,
  PAGINATION_LIMIT,
} from "../../utils/queryFn";
import {
  ClipboardIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { Edit } from "./Edit";

export const Get = () => {
  const [editingLink, setEditingLink] = useState<string | undefined>(undefined);
  const [initialValues, setInitialValues] = useState<
    { key: string; url: string } | undefined
  >(undefined);

  const [deleteLink, setDeleteLink] = useState<string | undefined>(undefined);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isFetching,
    refetch,
  } = useInfiniteQuery<{
    data: Link[];
    nextPage: number | null | undefined;
  }>({
    queryKey: ["links"],
    queryFn: ({ pageParam = 1 }) => getLinks(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
  });

  const handleLinkDeletion = async (key: string, count: number) => {
    if (deleteLink !== undefined) {
      return;
    }

    setDeleteLink(key);
    const state = await deleteUserLink(key);
    if (state === "fail") {
      setDeleteLink(undefined);
      toast.error("Deletion failed");
      return;
    }

    const page = Math.floor(count / PAGINATION_LIMIT);
    await refetch();
    setDeleteLink(undefined);

    toast.success("Deleted the link successfully");
  };

  const copyLink = (key: string) => {
    if (typeof window === "undefined") {
      return;
    }

    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND}/${key}`);
    toast.success("Copied");
    return;
  };

  const editLink = (url: string, key: string) => {
    if (editingLink !== undefined) {
      return;
    }

    setInitialValues({
      url: url,
      key: key,
    });
    setEditingLink(key);
  };

  return (
    <div className="flex flex-col gap-3 mt-24">
      <>
        {data ? (
          <>
            {data.pages ? (
              <div className="flex flex-col gap-10">
                {data.pages.map((links, i) => (
                  <Fragment key={i}>
                    {links.data.map((link, j) => (
                      <Fragment key={j}>
                        {link.Key === editingLink ? (
                          <Edit
                            initialValues={initialValues}
                            setInitialValues={setInitialValues}
                            setEditingLink={setEditingLink}
                            link={link}
                            key={j}
                          />
                        ) : (
                          <span
                            className="flex flex-col gap-4 sm:flex-col sm:gap-4"
                            key={j}
                          >
                            <label className="w-80 text-black sm:w-96 input bg-[#D7D5D5] truncate inline-flex items-center justify-self-center">
                              {link.URL}
                            </label>

                            <span className="flex justify-start items-center">
                              <label className="w-80 text-black sm:w-64 input bg-[#D7D5D5] truncate inline-flex items-center justify-self-center">
                                {link.Key}
                              </label>

                              <span className="flex gap-2">
                                <span
                                  className="hidden ml-4 w-44 text-green-500 cursor-pointer sm:inline-flex sm:w-8"
                                  onClick={() => copyLink(link.Key)}
                                >
                                  <ClipboardIcon />
                                </span>
                                <span
                                  className="hidden w-44 text-red-400 cursor-pointer sm:inline-flex sm:w-8"
                                  onClick={async () =>
                                    await handleLinkDeletion(link.Key, j)
                                  }
                                >
                                  <>
                                    {link.Key === deleteLink ? (
                                      <span className="loading loading-dots loading-lg"></span>
                                    ) : (
                                      <TrashIcon />
                                    )}
                                  </>
                                </span>
                                <span
                                  className="hidden w-44 cursor-pointer sm:inline-flex sm:w-8 text-slate-400"
                                  onClick={() => editLink(link.URL, link.Key)}
                                >
                                  <PencilSquareIcon />
                                </span>
                              </span>
                            </span>
                            <span className="flex flex-row gap-2 justify-start items-start sm:hidden">
                              <button
                                className="w-36 text-white sm:hidden btn btn-success btn-active disabled:btn-disabled"
                                onClick={() => copyLink(link.Key)}
                              >
                                <ClipboardIcon className="w-6" />
                                Copy
                              </button>

                              <button
                                className="w-36 text-white sm:hidden btn bg-slate-400 btn-active disabled:btn-disabled"
                                onClick={() => editLink(link.URL, link.Key)}
                                disabled={setEditingLink !== undefined}
                              >
                                <PencilSquareIcon className="w-6" />
                                Edit
                              </button>
                            </span>

                            <button
                              className="w-36 text-white sm:hidden btn btn-error btn-active disabled:btn-disabled"
                              onClick={() => handleLinkDeletion(link.Key, j)}
                              disabled={deleteLink !== undefined}
                            >
                              <TrashIcon className="w-6" />
                              <>
                                {link.Key === deleteLink ? (
                                  <span className="loading loading-dots loading-lg"></span>
                                ) : (
                                  "Delete"
                                )}
                              </>
                            </button>
                          </span>
                        )}
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </>

      <>
        {data ? (
          <button
            className="my-16 text-white btn btn-info disabled:btn-active"
            disabled={
              isFetching ||
              isFetchingNextPage ||
              isFetchingPreviousPage ||
              !hasNextPage
            }
            onClick={async () => await fetchNextPage()}
          >
            {isFetching ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              <span>Load more</span>
            )}
          </button>
        ) : null}
      </>
    </div>
  );
};
