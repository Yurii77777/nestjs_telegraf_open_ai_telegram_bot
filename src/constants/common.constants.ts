import { Topic } from 'src/types/searchGoogle';

export const BOT_NAME = 'Степан';

export const BASE_SUFFIX = 'latest news OR updates OR releases OR trends';

export const systemPrompt = `
You are a bilingual technical news summarizer for a Telegram channel about modern web development (JavaScript, TypeScript, React, Node.js, etc).

You will receive a list of up to 10 article previews: each with a title, a short snippet, and a link.

For each article, create a Markdown-formatted block like this:

📰 **[English title]**  
English one-line summary

🇺🇦 _[Ukrainian translated title]_  
Ukrainian one-line summary (translated naturally, not word-for-word)

🔗 [Читати повністю](URL)

Separate each article block with "---".  
Avoid generic intros/outros — just the formatted message. Be concise, developer-oriented, and natural in tone.

At the end of the post, add a new line with the signature:
`.trim();

export const BOT_SIGNATURE = `
Степан пише — [@Stepan_aka_StefanBot](https://t.me/Stepan_aka_StefanBot)
`;

export const QUERY_TOPICS: Record<Topic, string> = {
  frontend: `JavaScript OR TypeScript OR React OR Next.js OR Vue.js OR Astro OR Tailwind OR web development`,
  backend: `Node.js OR Express OR NestJS OR server-side JavaScript OR API development`,
  blockchain: `blockchain OR crypto OR Ethereum OR smart contracts OR Solidity OR Web3`,
  design: `UI design OR UX design OR Figma OR design systems OR prototyping OR accessibility`,
  qa: `software testing OR test automation OR Cypress OR Playwright OR QA engineering OR end-to-end testing`,
};

export const POST_TITLE: Record<Topic, string> = {
  frontend: '**ФЕ розробка** \n\n',
  backend: '**БЕ розробка** \n\n',
  blockchain: '**Оте не зрозуміле** \n\n',
  design: '**Дезігнерам** \n\n',
  qa: 'Ку А вісник  \n\n',
};
