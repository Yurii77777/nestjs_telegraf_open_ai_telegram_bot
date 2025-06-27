import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenAiModel } from '../types/openAi';

@Injectable()
export class OpenaiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(
    prompt: string,
    instructions: string,
  ): Promise<string> {
    const response = await this.client.responses.create({
      model: OpenAiModel.GPT_4O_MINI,
      instructions,
      input: prompt,
    });
    return response.output_text;
  }
}
