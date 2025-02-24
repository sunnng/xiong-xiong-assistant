import { z } from "zod";

// 密码熵计算辅助函数
const calculateEntropy = (password: string): number => {
  const charTypes = {
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[\W_]/.test(password),
  };

  // 计算字符集大小
  let charsetSize = 0;
  if (charTypes.lower) charsetSize += 26;
  if (charTypes.upper) charsetSize += 26;
  if (charTypes.number) charsetSize += 10;
  if (charTypes.symbol) charsetSize += 32; // 常见特殊符号数量

  // 熵计算公式：E = L * log2(N)
  return password.length * Math.log2(charsetSize || 1);
};

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "姓名至少需要 2 个字符")
    .max(50, "姓名最多 50 个字符")
    .regex(/^[\p{L} '\-]+$/u, "仅允许字母、空格、连字符和撇号"),

  email: z
    .string()
    .email("无效的邮箱格式")
    .max(100, "邮箱最多 100 个字符")
    .refine((val) => !val.endsWith("@example.com"), "禁止使用示例邮箱"),

  password: z
    .string()
    .min(12, "密码至少需要 12 个字符")
    .max(100, "密码最多 100 个字符")
    .regex(/[A-Z]/, "需要至少一个大写字母")
    .regex(/[a-z]/, "需要至少一个小写字母")
    .regex(/\d/, "需要至少一个数字")
    .regex(/[\W_]/, "需要至少一个特殊符号")
    .refine(
      (pwd) => calculateEntropy(pwd) >= 100,
      "密码强度不足，请使用更复杂的组合"
    )
    .refine((pwd) => !/(.)\1{2,}/.test(pwd), "不允许连续重复字符 (如 aaa)"),
});
