require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ 請設定 OPENAI_API_KEY 環境變數');
  process.exit(1);
}

const app = express();

// 支援多個合法前端網址
const allowedOrigins = [
  "https://smart-resume-eight.vercel.app",
  "https://smart-resume-plum.vercel.app",
  // 你可以繼續加其他 Vercel 預覽網址或 localhost
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // 允許本地開發時 origin 為 undefined
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 處理所有 OPTIONS 預檢請求
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/gpt", async (req, res) => {
  try {
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
      default:
        return res.status(400).json({ error: "mode 參數錯誤" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "你是一位履歷顧問，專門幫人優化履歷與翻譯。" },
        { role: "user", content: prompt }
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "伺服器錯誤或 OpenAI API 失敗" });
  }
});

app.listen(3001, () => {
  console.log("Server running on https://smart-resume-1sx2.onrender.com");
});
