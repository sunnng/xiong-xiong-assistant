import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

const $login = client.api.auth.login["$post"];

type RequestType = InferRequestType<typeof $login>;
type ResponseType = InferResponseType<typeof $login, 200>;

export const useLogin = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await $login(json);

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
