import { OpenAI } from 'openai';
import FirebaseService from './firebase.service';

export class OpenAIService {
  private readonly openai = new OpenAI();
  private firebaseService: FirebaseService;

  constructor() {
    this.firebaseService = new FirebaseService();
  }

  private async getAssistantIdByOperator(cnpj: string) {
    const data = await this.firebaseService.getOperatorByCNPJ(cnpj);

    if (!data) {
      throw new Error('Operator not found for the provided CNPJ');
    }

    const operatorToAssistantId: { [key: string]: string } = {
      'assistant_00': process.env.X_OPENAI_ASSISTANT as string,
      'assistant_01': process.env.Y_TIM_OPENAI_ASSISTANT as string,
      'assistant_02': process.env.Z_CLARO_OPENAI_ASSISTANT as string,
    };

    return operatorToAssistantId[data.operator.toLowerCase()] || process.env.DEFAULT_OPENAI_ASSISTANT as string;
  }

  async askChatGpt(content: string, cnpj: string) {
    if (!content) throw new Error('User message not received.');

    const assistantId = await this.getAssistantIdByOperator(cnpj);
    const assistant = await this.openai.beta.assistants.retrieve(assistantId);
    const threadId = await this.openai.beta.threads.create();

    await this.openai.beta.threads.messages.create(threadId.id, {
      role: 'assistant',
      content: content,
    });

    const run = await this.openai.beta.threads.runs.createAndPoll(threadId.id, {
      model: assistant.model,
      assistant_id: assistant.id,
      instructions: assistant.instructions,
    });

    if (run.status !== "completed")
      throw new Error(`ChatGPT run did not complete successfully: ${run.status}`);

    const messages = await this.openai.beta.threads.messages.list(run.thread_id);

    // @ts-ignore
    const rawMessage = messages.data[0].content[0].text.value;

  const formattedMessage = rawMessage
    .replace(/\\n/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\"/g, '')
    .replace(/\\'/g, '')
    .replace(/\\\\/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return formattedMessage;
  }
}
