import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { session } from 'telegraf';
import { TelegramUtils } from './telegram.utils';
import { GoogleModule } from '../google/google.module';
import { OpenaiModule } from '../openai/openai.module';

import { TelegramController } from './telegram.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      middlewares: [session()],
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
    GoogleModule,
    OpenaiModule,
  ],
  controllers: [],
  providers: [TelegramController, TelegramUtils],
  exports: [TelegramUtils],
})
export class TelegramModule {}
