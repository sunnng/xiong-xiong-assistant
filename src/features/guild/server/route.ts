import { Hono } from "hono";

import { zValidator } from "@/lib/validator-wrapper";

import { GuildBattleSchema } from "../schemas";

const app = new Hono().post(
  "/guildRaid",
  zValidator("json", GuildBattleSchema),
  async (c) => {
    const data = c.req.valid("json");

    return c.json({ data });
  }
);

export default app;
