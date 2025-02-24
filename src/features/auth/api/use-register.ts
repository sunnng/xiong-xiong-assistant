import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

const $register = client.api.auth.register["$post"];

type RequestType = InferRequestType<typeof $register>;
type ResponseType = InferResponseType<typeof $register>;

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.auth.register["$post"](json);

      if (!res.ok) {
        throw new Error("注册失败");
      }

      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("注册成功：" + data.name);
    },
    onError: (error) => {
      toast.error("出现了一些错误：" + error.message);
    },
  });

  return mutation;
};
