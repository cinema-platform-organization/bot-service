import { session, Telegraf } from "telegraf";

import { CONFIG } from "@/config";
import type { Session, TelegrafContext } from "@/shared/interfaces";
import { logger } from "@/shared/logger";

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

	bot.catch(async (error, ctx) => {
		logger.error(
			{ err: error, updateType: ctx.updateType, chatId: ctx.chat?.id },
			"Unhandled error in bot handler",
		);

		try {
			await ctx.reply("Something went wrong. Please try again later.");
		} catch {}
	});

	return bot;
}
