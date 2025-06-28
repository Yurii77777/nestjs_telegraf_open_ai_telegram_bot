import { Context, Telegraf } from 'telegraf';
import { InjectBot, Start, Update, Help, Command, On } from 'nestjs-telegraf';

import { GoogleService } from '../google/google.service';
import { TelegramUtils } from './telegram.utils';
import { OpenaiService } from '../openai/openai.service';
import { systemPrompt } from 'src/constants/common.constants';

import { COMMANDS } from './telegram.commands';
import { BOT_MESSAGES } from './telegram.messages';
import {
  BOT_NAME,
  BOT_SIGNATURE,
  POST_TITLE,
  QUERY_TOPICS,
} from 'src/constants/common.constants';
import { Topic } from 'src/types/searchGoogle';

// Temporary storage for users who share their phone number
const awaitingPhoneUsers = new Map<number, boolean>();

@Update()
export class TelegramController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly googleService: GoogleService,
    private readonly telegramUtils: TelegramUtils,
    private readonly openaiService: OpenaiService,
  ) {
    this.bot.telegram.setMyCommands(COMMANDS);
  }

  @Start()
  async startCommand(ctx): Promise<any> {
    const userTelegramName: string =
      ctx?.update?.message?.from?.first_name ||
      ctx?.update?.message?.from?.username;

    try {
      await ctx.reply(
        `${userTelegramName}${BOT_MESSAGES.USER_GREETING.replace(
          '${BOT_NAME}',
          BOT_NAME,
        )}`,
      );
    } catch (error) {
      console.log('startCommand :::', error.message);
      await ctx.reply(
        `${BOT_MESSAGES.ERROR.GENERAL} ERROR ::: ${error.message}`,
      );
    }
  }

  @Command('search_and_publish')
  async searchAndPublishCommand(ctx: Context): Promise<any> {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Set flag — waiting for phone number
    awaitingPhoneUsers.set(userId, true);

    try {
      await this.telegramUtils.sharePhone(ctx);
    } catch (error) {
      console.log('searchAndPublishCommand :::', error.message);
      await ctx.reply(
        `${BOT_MESSAGES.ERROR.GENERAL} ERROR ::: ${error.message}`,
      );
    }
  }

  @On('message')
  async onMessage(ctx): Promise<any> {
    const contact = ctx.message?.contact;
    const userId = ctx.from?.id;

    try {
      if (!contact || !userId || !awaitingPhoneUsers.has(userId)) {
        return await ctx.reply(BOT_MESSAGES.ERROR.SHARE_PHONE, {
          reply_markup: {
            remove_keyboard: true,
          },
        });
      }

      // Delete user from awaitingPhoneUsers
      awaitingPhoneUsers.delete(userId);

      const phone = contact.phone_number;

      // Check if phone number is admin
      if (phone !== process.env.ADMIN_PHONE_NUMBER) {
        return await ctx.reply(BOT_MESSAGES.ERROR.ADMIN_PHONE_NUMBER, {
          reply_markup: {
            remove_keyboard: true,
          },
        });
      }

      await ctx.reply(BOT_MESSAGES.ADMIN_SUCCESS, {
        reply_markup: {
          remove_keyboard: true,
        },
      });

      // Search and publish
      Object.keys(QUERY_TOPICS).map(async (topic: Topic) => {
        const query = this.telegramUtils.createQuery(topic);
        const results = await this.googleService.searchGoogle(query);
        const userPrompt = results
          .map(
            (item, index) =>
              `#${index + 1}\nTitle: ${item.title}\nSnippet: ${
                item.snippet
              }\nLink: ${item.link}`,
          )
          .join('\n\n');
        const post = await this.openaiService.generateResponse(
          userPrompt,
          systemPrompt,
        );
        const formattedPost = `
        ${POST_TITLE[topic]}
        ${post}
        ${BOT_SIGNATURE}
      `.trim();
        await ctx.telegram.sendMessage(
          process.env.TELEGRAM_PUBLIC_CHANNEL,
          formattedPost,
          {
            parse_mode: 'Markdown',
          },
        );
      });
    } catch (error) {
      console.log('onMessage :::', error.message);
      await ctx.reply(
        `${BOT_MESSAGES.ERROR.GENERAL} ERROR ::: ${error.message}`,
      );
    }
  }

  @Help()
  async helpCommand(ctx): Promise<any> {
    try {
      await ctx.reply(
        BOT_MESSAGES.HELP_INFO.replace('${BOT_NAME}', BOT_NAME).replace(
          '${CHANNEL_NAME}',
          process.env.TELEGRAM_PUBLIC_CHANNEL,
        ),
      );
    } catch (error) {
      console.log('helpCommand :::', error.message);
      await ctx.reply(
        `${BOT_MESSAGES.ERROR.GENERAL} ERROR ::: ${error.message}`,
      );
    }
  }
}
