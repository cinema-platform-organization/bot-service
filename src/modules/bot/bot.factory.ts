import { session, Telegraf } from "telegraf";

import { CONFIG } from "@/config";
import type { Session, TelegrafContext } from "@/shared/interfaces";

import { registerBotHandlers } from "./handlers";

export function createBot(): Telegraf<TelegrafContext> {
	const botToken = CONFIG.BOT_TOKEN;
	if (!botToken) {
		throw new Error("No bot token env");
	}

	const bot = new Telegraf<TelegrafContext>(botToken);

	bot.use(
		session({
			defaultSession: (): Session => ({
				id: undefined,
			}),
		}),
	);

	registerBotHandlers(bot);

	return bot;
}
