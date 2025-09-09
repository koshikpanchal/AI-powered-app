import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

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

app.get('/', (req: Request, res: Response) => {
   res.send('Hello world');
});

const conversations = new Map<string, string>();

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt, conversationId } = req.body;

   try {
      const response = await client.responses.create({
         model: MODEL,
         input: prompt,
         temperature: 0.2,
         previous_response_id: conversations.get(conversationId),
      });

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
