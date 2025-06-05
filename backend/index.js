require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ 請設定 GEMINI_API_KEY 環境變數');
  process.exit(1);
}

const app = express();

// 支援所有 smart-resume-xxx.vercel.app 與本地開發
const allowedOrigins = [
  "http://localhost:3000",
  "https://smart-resume-eight.vercel.app",
];

function checkOrigin(origin, callback) {
  if (
    !origin ||
    allowedOrigins.includes(origin) ||
    /^https:\/\/smart-resume-[\w-]+\.vercel\.app$/.test(origin)
  ) {
    callback(null, origin);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
}

app.use(cors({
  origin: checkOrigin,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options('*', cors({
  origin: checkOrigin,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// 這裡用 Gemini API Key 和 Gemini endpoint
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
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

    // Gemini 支援 openai.chat.completions.create
    const completion = await openai.chat.completions.create({
      model: "gemini-1.5-flash", // 或 gemini-1.5-pro、gemini-pro
      messages: [
        { role: "system", content: "你是一位履歷顧問，專門幫人優化履歷與翻譯。" },
        { role: "user", content: prompt }
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "伺服器錯誤或 Gemini API 失敗" });
  }
});

app.listen(3001, () => {
  console.log("Server running on https://smart-resume-1sx2.onrender.com");
});
