import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { registerSchema } from "../schemas";

const app = new Hono().post(
  "/register",
  zValidator("json", registerSchema),
  (c) => {
    const data = c.req.valid("json");

    return c.json({
      success: true,
      message: `register success`,
      data,
    });
  }
);

export default app;
