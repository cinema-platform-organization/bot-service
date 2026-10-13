import {
	TelegramCompleteRequest,
	TelegramCompleteResponse,
} from "@cinema-platform/contracts/gen/ts/auth";
import { status } from "@grpc/grpc-js";
import type { Telegraf } from "telegraf";

import { authClient } from "@/infrastructure/grpc/auth.client";
import type { TelegrafContext } from "@/shared/interfaces";
import { logger } from "@/shared/logger";
import { callUnary } from "@/shared/utils";

export function registerContactHandler(bot: Telegraf<TelegrafContext>) {
	bot.on("contact", async ctx => {
		const phone = ctx.message.contact.phone_number;

		if (!ctx.chat.id || !ctx.session.id) {
			logger.warn(
				{ chatId: ctx.chat.id },
				"Contact received without a login session",
			);

			return ctx.reply(
				"An error occurred. Please start the process through the website.",
			);
		}

		const request: TelegramCompleteRequest = {
			sessionId: ctx.session.id,
			phone,
		};

		try {
			const { sessionId } = await callUnary<TelegramCompleteResponse>(
				authClient.telegramComplete.bind(authClient),
				request,
			);

			logger.info({ chatId: ctx.chat.id }, "Telegram login completed");

			await ctx.reply("Registration completed successfully!", {
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: "Return to website",
								url: `https://cinema-platform.site/auth/tg-finalize?sessionId=${sessionId}`,
							},
						],
					],
					remove_keyboard: true,
				},
			});
		} catch (error) {
			const code = (error as { code?: number }).code;

			if (code === status.ALREADY_EXISTS) {
				logger.warn(
					{ chatId: ctx.chat.id },
					"Phone already linked to another account",
				);

				return ctx.reply(
					"This phone number is already linked to another account. Please log in with your phone number on the website.",
				);
			}

			if (code === status.NOT_FOUND) {
				logger.warn(
					{ chatId: ctx.chat.id },
					"Telegram login session expired",
				);

				return ctx.reply(
					"Your login session has expired. Please start again from the website.",
				);
			}

			logger.error(
				{ err: error, chatId: ctx.chat.id },
				"Failed to complete Telegram registration",
			);

			await ctx.reply(
				"An error occurred while completing your registration. Please try again from the website.",
			);
		}
	});
}
