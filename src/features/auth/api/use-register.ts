import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

const $register = client.api.auth.register["$post"];

type RequestType = InferRequestType<typeof $register>;
type ResponseType = InferResponseType<typeof $register, 200>;

export const useRegister = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await $register(json);

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
