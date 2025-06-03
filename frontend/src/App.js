import { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("improve");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setOutputText("");
    try {
      const res = await fetch("https://smart-resume-1sx2.onrender.com/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText, mode }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setOutputText(data.reply);
    } catch (err) {
      setOutputText("❌ 請求失敗，請檢查伺服器是否啟動，或網路連線/URL 是否正確。\n" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">智能履歷助手</h1>
      <textarea
        className="w-full border p-2 rounded"
        rows="6"
        placeholder="請輸入你的履歷內容..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          className={mode === "improve" ? "bg-blue-200" : ""}
          onClick={() => setMode("improve")}
        >
          優化履歷
        </button>
        <button
          className={mode === "translate-en" ? "bg-blue-200" : ""}
          onClick={() => setMode("translate-en")}
        >
          中翻英
        </button>
        <button
          className={mode === "translate-zh" ? "bg-blue-200" : ""}
          onClick={() => setMode("translate-zh")}
        >
          英翻中
        </button>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "分析中..." : "開始分析"}
      </button>
      <textarea
        className="w-full border p-2 rounded"
        rows="6"
        readOnly
        placeholder="AI 回應結果會出現在這裡"
        value={outputText}
      />
    </div>
  );
}

export default App;
