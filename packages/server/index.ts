import express, { request } from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'prompt is required')
      .max(1000, 'prompt is too big, 100 characters only'),
   conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      res.status(400).json(parseResult.error);
      return;
   }

   try {
      const { prompt, conversationId } = req.body;
      const response = await chatService.sendMessage(prompt, conversationId);
      res.json({ reply: response.message });
   } catch (err: any) {
      console.error(err.response?.data || err.message);
      res.status(500).json({ error: err.response?.data || err.message });
   }
});

app.listen(port, () => {
   console.log(`✅ Server running at http://localhost:${port}`);
});
