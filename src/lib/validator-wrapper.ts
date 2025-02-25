import { ZodError, ZodSchema } from "zod";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";

function formatZodErrorsToString(error: ZodError): string {
  const issues = error.issues;

  // 按字段分组错误
  const groupedErrors: Record<string, string[]> = {};

  issues.forEach((issue) => {
    const field = issue.path.join("."); // 获取字段路径
    const message = issue.message; // 获取错误消息

    if (!groupedErrors[field]) {
      groupedErrors[field] = [];
    }
    groupedErrors[field].push(message);
  });

  // 构建用户友好的文字
  const friendlyMessages = Object.entries(groupedErrors).map(
    ([field, messages]) => {
      const formattedMessages = messages.join("，且");
      return `${field}字段存在问题：${formattedMessages}。`;
    }
  );

  // 合并所有字段的错误信息
  const fullMessage = friendlyMessages.join("\n");

  return fullMessage || "提交的数据没有问题！";
}

export const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets
>(
  target: Target,
  schema: T
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      const friendlyErrorString = formatZodErrorsToString(result.error);
      return c.json(
        {
          success: false,
          message: friendlyErrorString,
        },
        400
      );
    }
  });
