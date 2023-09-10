import { useInfiniteQuery } from "@tanstack/react-query"
import { LIMIT, deleteLink, getLinks } from "../../utils/queryFn"
import { string } from "zod"
import { toast } from "react-hot-toast"

export const Get = () => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isFetching,
    refetch
  } = useInfiniteQuery<{
    data: Link[],
    nextPage: number | null | undefined
  }>({
    queryKey: ["links"],
    queryFn: ({ pageParam = 1}) => getLinks(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true
  })

  const deleteLinks = async (key: string, count: number) => {
    const state = await deleteLink(key)
    if (state === "fail") {
      toast.error("Deletion failed")
      return
    }


    toast.success("Deleted the link successfully")
    const page = Math.floor(count/LIMIT)
    await refetch()
  }

  return (
    <div className="flex flex-col gap-3 mt-24">
      <>
        {data ? (
          <>
            {data.pages ? (
              <div className="flex flex-col gap-10">
                {data.pages.map((links) => (
                  <>
                    {links.data.map((link, index) => (
                      <span className="flex flex-col gap-4 sm:flex-row sm:gap-4" key={index}>
                        <label
                          className="w-80 text-black sm:w-72 input bg-[#D7D5D5] truncate inline-flex items-center justify-self-center"
                        >
                          {link.URL}
                        </label>
                        <label
                          className="w-80 text-black sm:w-48 input bg-[#D7D5D5] truncate inline-flex items-center justify-self-center"
                        >
                          {link.Key}
                        </label>


                        <span
                          className="hidden w-44 text-green-500 cursor-pointer sm:inline-flex sm:w-8"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                          </svg>
                        </span>
                        <span
                          className="hidden w-44 text-red-400 cursor-pointer sm:inline-flex sm:w-8"
                          onClick={async () => await deleteLinks(link.Key, index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </span>


                        <button
                          className="w-36 text-white sm:hidden btn btn-error btn-active disabled:btn-disabled"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          Delete
                        </button>

                        <button
                          className="w-36 text-white sm:hidden btn btn-success btn-active disabled:btn-disabled"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                          </svg>
                          Copy
                        </button>
                      </span>
                    ))}
                  </>
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
            disabled={isFetching || isFetchingNextPage || isFetchingPreviousPage || !hasNextPage}
            onClick={async () => await fetchNextPage()}
          >
          {(isFetching) ? <span className="loading loading-dots loading-lg"></span> : <span>Load more</span>}
          </button>
        ) : null}
      </>
    </div>
  )
}
