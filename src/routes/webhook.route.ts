import { Router } from 'express';
import { WebhookController } from '../controller/webhook.controller';

const router = Router();
const webhookController = new WebhookController();

router.post('/default/webhook', (req, res) => {
  webhookController.handleWebhook(req, res);
});

router.post('/default/cnpj-validate', (req, res) => {
  webhookController.cnpjValidate(req, res);
});

export default router;

