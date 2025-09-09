import express, { request } from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import z from 'zod';
import { conversationRepository } from './repositories/conversation.repository';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Hugging Face model endpoint via OpenAI SDK
const MODEL = 'HuggingFaceTB/SmolLM3-3B:hf-inference';

// Create a reusable client once
const client = new OpenAI({
   baseURL: 'https://router.huggingface.co/v1',
   apiKey: process.env.HUGGING_FACE_ACCESS_KEY,
});

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
      const response = await client.responses.create({
         model: MODEL,
         input: prompt,
         temperature: 0.2,
         previous_response_id:
            conversationRepository.getLastConversationId(conversationId),
      });

      conversationRepository.setLastConversationId(conversationId, response.id);

      let output = response.output_text
         .replace(/<think>[\s\S]*?<\/think>/g, '')
         .trim();

      res.json({ reply: output });
   } catch (err: any) {
      console.error(err.response?.data || err.message);
      res.status(500).json({ error: err.response?.data || err.message });
   }
});

app.listen(port, () => {
   console.log(`✅ Server running at http://localhost:${port}`);
});
