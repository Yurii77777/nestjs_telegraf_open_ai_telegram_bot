# Telegram Bot. NestJS, Telegraf, Google Custom Search API, OpenAI API


## How To Start

- `yarn install`;

Create `.env` file:

- `PORT` = 3080;
- `TELEGRAM_BOT_TOKEN` = TG bot's token;
- `TELEGRAM_PUBLIC_CHANNEL` = TG public channel. Ex. @stepanhotnews;
- `GOOGLE_API_KEY` = Google API key (from Google Console);
- `GOOGLE_CX` = Google Custom Search CX;
- `OPENAI_API_KEY` = OpenAI API Key;
- `ADMIN_PHONE_NUMBER` = admin phone number; Ex. 380951001010

`yarn start`

### Quick Guide

1. Create a Telegram channel

2. Create a Telegram Bot via BotFather

3. Add Telegram Bot to the Telegram channel as Admin

4. Customize 'systemPrompt' and queries in the common.constants.ts file as you need

5. Enable 'Custom Search API' in the Google Console. Create API Key.
Ex. <script async src="https://cse.google.com/cse.js?cx=xxxxxxxxx"> where xxxxxx = your CX

6. Set all env variables

7. yarn install / npm i

8. yarn start / npm run start

9. Go to the Telegram Bot and select the Start command

10. Enjoy!
