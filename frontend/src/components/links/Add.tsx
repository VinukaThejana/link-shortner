import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { getBackendPath } from "../../utils/path";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import { Toast } from "../utils/Toast";

export const Add = () => {
  const [checkingKey, setCheckingKey] = useState(false)
  const [keyValid, setKeyValid] = useState(true)

  const schema = z.object({
    link: z.string().url({ message: "URL not valid" }).min(10, { message: "URL not valid" }),
    key: z.string().min(2, { message: "too small" }).max(20, { message: "too large"}).optional().or(z.literal(""))
  })
  type AddLink = z.infer<typeof schema>

  const { register, handleSubmit, watch, setError, clearErrors ,formState: { errors }, reset } = useForm<AddLink>({
    resolver: zodResolver(schema)
  })
  const key = watch("key", "")

  const checkKey = useCallback(debounce(async (key: string) => {
    if (key.length <= 2 || key.length > 20) {
      setCheckingKey(false)
      setError("key", {
        message: "invalid"
      })
      setKeyValid(false)
      return
    }

    setCheckingKey(true)
    clearErrors("key")

    const res = await fetch(getBackendPath("/check/links/key"), {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        "key": key
      })
    })

    if (res.status !== 200) {
      console.log("Not okay response code")
      setError("key", {
        message: "invalid"
      })
      setKeyValid(false)
      setCheckingKey(false)
      return
    }

    const data = await res.json() as {
      available: boolean
    }

    if (data.available) {
      clearErrors("key")
      setKeyValid(true)
      setCheckingKey(false)
      return
    } else {
      setError("key", {
        message: "already used"
      })
      setKeyValid(false)
      setCheckingKey(false)
    }
    setCheckingKey(false)

    return
  }, 500), [])

  useEffect(() => {
    if (!key || key === "") {
      clearErrors("key")
      setKeyValid(true)
      return
    }

    checkKey(key)
  }, [key])

  const onSubmit = async (d: AddLink) => {
    const res = await fetch(getBackendPath("/links/new"), {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        "link": d.link,
        "key": d.key
      })
    })

    if (res.status !== 200) {
      toast.error("Error addding the link")
      return
    }

    toast.success("Link created successfully")
    reset();
  }

  return (
    <form className="flex flex-col gap-2 items-start form-control" onSubmit={handleSubmit(async (e) => await onSubmit(e))}>
      <span className="flex flex-col gap-7 sm:flex-row sm:gap-4">
        <span className="flex flex-col">
          <input
            type="text"
            className="w-80 text-black sm:w-96 input input-bordered"
            placeholder="Enter the long URL"
            {...register("link")}
          />
          <span className="relative">
            <label
              className="absolute mt-1 ml-1 text-xs text-left text-red-600 input-error"
            >
              {errors.link?.message}
            </label>
          </span>
        </span>
        <span className="flex flex-col">
          <input
            type="text"
            className="w-80 text-black sm:w-48 input input-bordered"
            placeholder="Key (Optional)"
            {...register("key")}
          />
          {errors.key?.message && (
          <span className="relative">
            <label
              className="absolute z-50 mt-1 ml-1 text-xs text-left text-red-600 input-error"
            >
              {errors.key.message}
            </label>
          </span>
          )}
        </span>
      </span>

      <button
        className="mt-6 w-36 sm:mt-4 btn btn-ghost btn-active disabled:btn-disabled"
        type="submit"
        disabled={!keyValid || checkingKey}
      >
        <>
          {checkingKey ? <span className="loading loading-dots loading-lg"></span> : <span>Create</span>}
        </>
      </button>
      <Toast />
    </form>
  )
}
