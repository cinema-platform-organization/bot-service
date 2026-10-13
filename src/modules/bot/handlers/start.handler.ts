import { Markup, Telegraf } from "telegraf";

import type { TelegrafContext } from "@/shared/interfaces";
import { logger } from "@/shared/logger";

export function registerStartHandler(bot: Telegraf<TelegrafContext>) {
	bot.start(async ctx => {
		const sessionId = ctx.startPayload;

		if (!sessionId) {
			logger.debug({ chatId: ctx.chat.id }, "/start without session");

			return ctx.reply(
				"Hello! To continue, please log in on the site",
				Markup.inlineKeyboard([
					[
						Markup.button.url(
							"Go to login",
							"https://cinema-platform.site/auth/login",
						),
					],
				]),
			);
		}

		ctx.session.id = sessionId;

		logger.info({ chatId: ctx.chat.id }, "Telegram login started");

		await ctx.reply(
			"To complete registration, please send your phone number",
			Markup.keyboard([[Markup.button.contactRequest("Share number")]]),
		);
	});
}
