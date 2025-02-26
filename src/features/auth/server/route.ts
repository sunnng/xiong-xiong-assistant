import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";
import { AppwriteException, ID } from "node-appwrite";

import { zValidator } from "@/lib/validator-wrapper";
import { createAdminClient } from "@/lib/appwrite";

import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    try {
      // 1. 创建客户端连接
      const { account } = await createAdminClient();

      await account.create(ID.unique(), email, password, name);

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({
        success: true,
        message: "注册成功",
        data: { name },
      });
    } catch (error) {
      if (error instanceof AppwriteException) {
        return c.json(
          {
            success: false,
            message: error.message,
          },
          error.code as ClientErrorStatusCode | ServerErrorStatusCode
        );
      } else {
        return c.json(
          {
            success: false,
            message: (error as Error).message,
          },
          401
        );
      }
    }
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    try {
      const { account } = await createAdminClient();
      // Create the session using the Appwrite client
      const session = await account.createEmailPasswordSession(email, password);

      // Set the session cookie
      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({
        success: true,
        message: "登录成功",
      });
    } catch (error) {
      if (error instanceof AppwriteException) {
        return c.json(
          {
            success: false,
            message: error.message,
          },
          error.code as ClientErrorStatusCode | ServerErrorStatusCode
        );
      } else {
        return c.json(
          {
            success: false,
            message: (error as Error).message,
          },
          401
        );
      }
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);

    await account.deleteSession("current");

    return c.json({ success: true, message: "退出登录！" });
  });

export default app;
