import type { Request, Response } from 'express';
import { OpenAIService } from '../services/openai.service';
import FirebaseService from '../services/firebase.service';

export class WebhookController {
  private openaiService: OpenAIService;
  private firebaseService: FirebaseService;

  constructor() {
    this.openaiService = new OpenAIService();
    this.firebaseService = new FirebaseService();
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const { cnpj, userMessage } = req.body;

      if (!userMessage || !cnpj)
        return res.status(400).json({ status: 'error', message: 'No message or CNPJ received' });

      const data = await this.firebaseService.getOperatorByCNPJ(cnpj);
      if (!data) return res.status(404).json({ status: 'error', message: 'CNPJ not found in database' });

      const chatGptResponse = await this.openaiService.askChatGpt(userMessage, cnpj);

      return res.status(200).json({
        cnpj,
        data,
        text: chatGptResponse,
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  async cnpjValidate(req: Request, res: Response) {
    try {
      const { cnpj } = req.body;

      if (!cnpj)
        return res.status(400).json({ status: 'error', message: 'No CNPJ received' });

      const data = await this.firebaseService.getOperatorByCNPJ(cnpj);
      if (!data) return res.status(404).json({ status: 'error', message: 'CNPJ not found in database' });

      return res.status(200).json({
        cnpj,
        data,
      });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
}

