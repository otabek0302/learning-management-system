import { env } from "@config/env.config";

const tgBotConfig = {
  token: env.TG_BOT_TOKEN,
  username: env.TG_BOT_USERNAME,
};

export { tgBotConfig };
