import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

const $logout = client.api.auth.logout["$post"];

type RequestType = InferRequestType<typeof $logout>;
type ResponseType = InferResponseType<typeof $logout, 200>;

export const useLogout = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const res = await $logout();

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      return await res.json();
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      router.push("/");
    },
    onError: (error) => {
      toast.error("错误：" + error.message);
    },
  });

  return mutation;
};
