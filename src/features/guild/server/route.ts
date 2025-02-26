import { Hono } from "hono";
import {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";
import { AppwriteException, ID } from "node-appwrite";

import { zValidator } from "@/lib/validator-wrapper";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, GUILDRAID_ID } from "@/config";

import { GuildBattleSchema } from "../schemas";

const app = new Hono().post(
  "/guildRaid",
  zValidator("json", GuildBattleSchema),
  async (c) => {
    const { guildName, seasonName, record } = c.req.valid("json");

    const { databases } = await createAdminClient();

    try {
      record.forEach(async (item) => {
        await databases.createDocument(DATABASE_ID, GUILDRAID_ID, ID.unique(), {
          ...item,
          guildName,
          seasonName,
        });
      });

      return c.json({ success: true });
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
  }
);

export default app;
