"use client";

import { Link } from "@/types/link";
import {
  updateLinkKey,
  updateLinkURL,
  updateLink,
  isKeyAvailable,
} from "@/utils/queryFn";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type InitialValues = {
  key: string;
  url: string;
};

export const Edit = (props: {
  link: Link;
  setEditingLink: Dispatch<SetStateAction<string | undefined>>;
  initialValues: InitialValues | undefined;
  setInitialValues: Dispatch<SetStateAction<InitialValues | undefined>>;
}) => {
  const { link, setEditingLink, initialValues, setInitialValues } = props;

  const [checkingKey, setCheckingKey] = useState(false);
  const [keyValid, setKeyValid] = useState(true);
  const [updatingLink, setUpdatingLink] = useState(false);

  const queryClient = useQueryClient();

  const schema = z.object({
    link: z
      .string()
      .url({ message: "URL not valid" })
      .min(10, { message: "URL not valid" }),
    key: z
      .string()
      .min(2, { message: "too small" })
      .max(30, { message: "too large" }),
  });
  type EditLink = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EditLink>({
    resolver: zodResolver(schema),
    defaultValues: {
      link: initialValues ? initialValues.url : undefined,
      key: initialValues ? initialValues.key : undefined,
    },
  });
  const key = watch("key", "");

  const checkKey = useCallback(
    debounce(async (key: string) => {
      if (key.length <= 2 || key.length > 30) {
        setCheckingKey(false);
        setError("key", {
          message: "invalid",
        });
        setKeyValid(false);
        return;
      }

      setCheckingKey(true);
      clearErrors("key");

      const state = await isKeyAvailable(key);
      if (state === "invalid") {
        setError("key", {
          message: "invalid",
        });
        setKeyValid(false);
        setCheckingKey(false);
        return;
      }

      if (state === "not available") {
        setError("key", {
          message: "already used",
        });
        setKeyValid(false);
        setCheckingKey(false);
        return;
      }

      clearErrors("key");
      setKeyValid(true);
      setCheckingKey(false);
      return;
    }, 500),
    [],
  );

  useEffect(() => {
    if (!key || key === "") {
      clearErrors("key");
      setKeyValid(true);
      return;
    }

    if (initialValues) {
      if (key === initialValues.key) {
        clearErrors("key");
        setKeyValid(true);
        return;
      }
    }

    checkKey(key);
  }, [key]);

  const onSubmit = async (data: EditLink) => {
    if (!initialValues) {
      toast.error("Something went wrong");
      return;
    }

    if (initialValues.key === data.key && initialValues.url === data.link) {
      setEditingLink(undefined);
      setInitialValues(undefined);
      return;
    }

    setUpdatingLink(true);

    if (initialValues.url === data.link) {
      const state = await updateLinkKey(initialValues.key, data.key);
      if (state === "fail") {
        setUpdatingLink(false);
        toast.error("Something went wrong");
        return;
      }
    } else if (initialValues.key === data.key) {
      const state = await updateLinkURL(data.key, data.link);
      if (state === "fail") {
        setUpdatingLink(false);
        toast.error("Something went wrong");
        return;
      }
    } else {
      const state = await updateLink(initialValues.key, data.key, data.link);
      if (state === "fail") {
        setUpdatingLink(false);
        toast.error("Something went wrong");
        return;
      }
    }

    await queryClient.refetchQueries({
      queryKey: ["links"],
      type: "active",
    });

    setEditingLink(undefined);
    setInitialValues(undefined);
    setUpdatingLink(false);
    return;
  };

  return (
    <form
      className="flex flex-col gap-4 sm:flex-col sm:gap-6"
      onSubmit={handleSubmit(async (data) => await onSubmit(data))}
    >
      <span className="flex flex-col">
        <input
          type="text"
          className="inline-flex justify-self-center items-center w-80 text-black sm:w-96 input-bordered input truncate"
          placeholder={link.URL}
          {...register("link")}
        />
        <span className="relative">
          <label className="absolute mt-1 ml-1 text-xs text-left text-red-600 input-error">
            {errors.link?.message}
          </label>
        </span>
      </span>

      <span className="flex justify-start items-center">
        <span className="flex flex-col">
          <input
            type="text"
            className="inline-flex justify-self-center items-center w-80 text-black sm:w-64 input input-bordered truncate"
            placeholder={link.Key}
            {...register("key")}
          />
          {errors.key?.message && (
            <span className="relative">
              <label className="absolute z-50 mt-1 ml-1 text-xs text-left text-red-600 input-error">
                {errors.key.message}
              </label>
            </span>
          )}
        </span>

        <button
          className="hidden ml-3 w-28 text-white sm:inline-flex btn btn-success btn-active disabled:btn-disabled"
          type="submit"
          disabled={checkingKey || !keyValid || updatingLink}
        >
          <>
            {checkingKey ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              <>
                {updatingLink ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  <>
                    <CheckBadgeIcon className="w-6" />
                    Save
                  </>
                )}
              </>
            )}
          </>
        </button>
      </span>
      <span className="flex flex-row gap-2 justify-start items-start sm:hidden">
        <button className="w-36 text-white sm:hidden btn btn-success btn-active disabled:btn-disabled">
          <>
            {checkingKey ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              <>
                {updatingLink ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  <>
                    <CheckBadgeIcon className="w-6" />
                    Save
                  </>
                )}
              </>
            )}
          </>
        </button>
      </span>
    </form>
  );
};
