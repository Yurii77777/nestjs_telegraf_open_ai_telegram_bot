import { Context } from 'telegraf';

import { Topic } from 'src/types/searchGoogle';
import {
  BASE_SUFFIX,
  BOT_NAME,
  QUERY_TOPICS,
} from 'src/constants/common.constants';
import { BOT_MESSAGES } from './telegram.messages';

export class TelegramUtils {
  createQuery(topic: Topic): string {
    const now = new Date();
    const monthYear = now.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    const baseSuffix = `${BASE_SUFFIX} ${monthYear}`;

    return `${QUERY_TOPICS[topic]} ${baseSuffix}`;
  }

  async sharePhone(ctx: Context) {
    // Create keyboard
    const keyboard = [
      [
        {
          text: BOT_MESSAGES.BUTTON.SHARE_PHONE_NUMBER,
          request_contact: true,
        },
      ],
    ];

    // Send message with keyboard
    try {
      await ctx.reply(
        BOT_MESSAGES.BUTTON.SHARE_PHONE_PARAGRAPH.replace(
          '${BOT_NAME}',
          BOT_NAME,
        ),
        {
          reply_markup: { keyboard },
        },
      );
    } catch (error) {
      console.log('sharePhone :::', error.message);
    }
  }
}
