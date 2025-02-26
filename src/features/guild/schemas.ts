import { z } from "zod";

// 假设的 Boss 类型枚举（根据实际值修改）
const BOSS_TYPES = ["结块的甘草海深渊", "命运大天使", "红丝绒蛋糕龙"] as const;

export const BattleRecordSchema = z.object({
  // 玩家名称（3-20字符，仅允许字母数字）
  username: z
    .string()
    .min(1, "用户名至少1个字符")
    .max(50, "用户名最多50个字符"),

  // 战斗力（非负整数）
  combatPower: z.number().int("必须是整数").nonnegative("战斗力不能为负数"),

  // BOSS 类型（枚举校验）
  bossType: z.enum(BOSS_TYPES, {
    errorMap: () => ({
      message: `无效的BOSS类型，可选值: ${BOSS_TYPES.join(", ")}`,
    }),
  }),

  // BOSS起始阶段（正整数）
  bossStartStage: z.number().int("必须是整数").positive("起始阶段必须大于0"),

  // BOSS结束阶段（需 >= 起始阶段）
  bossEndStage: z.number().int("必须是整数"),

  // 造成的伤害（非负整数）
  damage: z.number().int("必须是整数").nonnegative("伤害值不能为负数"),

  // 参与时间（ISO 8601 格式）
  joinTime: z.string().datetime({ message: "必须为有效的ISO 8601时间格式" }),
});

// 主 Schema (包含数组)
export const GuildBattleSchema = z.object({
  guildName: z.string().min(1).max(50),
  seasonName: z.string().min(1).max(100),

  // 数组校验（至少1条记录，最多100条）
  record: z
    .array(BattleRecordSchema)
    .min(1, "至少需要1名成员参与")
    .max(100, "最多记录100名成员"),
});
// 导出类型
export type GuildBattle = z.infer<typeof GuildBattleSchema>;
