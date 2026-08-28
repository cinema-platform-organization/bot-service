import { Markup, Telegraf } from "telegraf";

import type { TelegrafContext } from "@/shared/interfaces";

export function registerStartHandler(bot: Telegraf<TelegrafContext>) {
	bot.start(async ctx => {
		const sessionId = ctx.startPayload;

		if (!sessionId) {
			return ctx.reply(
				"Hello! To continue, please log in on the site",
				Markup.inlineKeyboard([
					[
						Markup.button.url(
							"Go to login",
							"https://cinema-platform.com/auth/login",
						),
					],
				]),
			);
		}

		ctx.session.id = sessionId;

		await ctx.reply(
			"To complete registration, please send your phone number",
			Markup.keyboard([[Markup.button.contactRequest("Share number")]]),
		);
	});
}
