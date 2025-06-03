require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/gpt", async (req, res) => {
  const { inputText, mode } = req.body;
  let prompt = "";

  switch (mode) {
    case "improve":
      prompt = `請將以下履歷內容優化為更正式專業的英文句子：${inputText}`;
      break;
    case "translate-en":
      prompt = `請將以下中文翻譯成專業英文履歷語句：${inputText}`;
      break;
    case "translate-zh":
      prompt = `請將以下英文翻譯為自然流暢的中文履歷描述：${inputText}`;
      break;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "你是一位履歷顧問，專門幫人優化履歷與翻譯。" },
      { role: "user", content: prompt }
    ],
  });

  const reply = completion.choices[0].message.content;
  res.json({ reply });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});

