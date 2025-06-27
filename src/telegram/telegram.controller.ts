import { Context, Telegraf } from 'telegraf';
import {
  InjectBot,
  Start,
  Update,
  Help,
  // Command, Action
} from 'nestjs-telegraf';

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
        `${userTelegramName}${BOT_MESSAGES.NEW_USER_GREETING.replace(
          '${BOT_NAME}',
          BOT_NAME,
        )}`,
      );

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
      console.log('startCommand :::', error.message);
      await ctx.reply(BOT_MESSAGES.ERROR_MESSAGE);
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
    }
  }
}
