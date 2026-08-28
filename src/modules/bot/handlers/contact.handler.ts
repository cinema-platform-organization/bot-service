import {
	TelegramCompleteRequest,
	TelegramCompleteResponse,
} from "@cinema-platform/contracts/gen/auth";
import type { Telegraf } from "telegraf";

import { authClient } from "@/infrastructure/grpc/auth.client";
import type { TelegrafContext } from "@/shared/interfaces";
import { callUnary } from "@/shared/utils";

export function registerContactHandler(bot: Telegraf<TelegrafContext>) {
	bot.on("contact", async ctx => {
		const phone = ctx.message.contact.phone_number;

		if (!ctx.chat.id || !ctx.session.id)
			return ctx.reply(
				"An error occurred. Please start the process through the website.",
			);

		const request: TelegramCompleteRequest = {
			sessionId: ctx.session.id,
			phone,
		};
		const { sessionId } = await callUnary<TelegramCompleteResponse>(
			authClient.telegramComplete.bind(authClient),
			request,
		);

		await ctx.reply("Registration completed successfully!", {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "Return to website",
							url: `https://cinema-platform.com/auth/tg-finalize?sessionId=${sessionId}`,
						},
					],
				],
				remove_keyboard: true,
			},
		});
	});
}
