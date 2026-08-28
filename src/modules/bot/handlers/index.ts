import { Telegraf } from "telegraf";

import type { TelegrafContext } from "@/shared/interfaces";

import { registerContactHandler } from "./contact.handler";
import { registerStartHandler } from "./start.handler";

export function registerBotHandlers(bot: Telegraf<TelegrafContext>) {
	registerStartHandler(bot);
	registerContactHandler(bot);
}
