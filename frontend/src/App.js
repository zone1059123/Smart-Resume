import { useState, useRef, useEffect } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("improve");
  const [loading, setLoading] = useState(false);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // 自動聚焦輸入框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 結果自動滾動到底
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputText]);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setOutputText("請先輸入履歷內容！");
      return;
    }
    setLoading(true);
    setOutputText("");
    try {
      const res = await fetch("https://smart-resume-djpf.onrender.com/api/gpt", {
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
      setOutputText("請求失敗，請檢查伺服器是否啟動，或網路連線/URL 是否正確。\n" + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 複製結果到剪貼簿
  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-2">智能履歷助手</h1>
        <p className="text-gray-500 text-center mb-4">
          輸入你的履歷內容，AI 將協助你優化或中翻英！
        </p>
        <textarea
          ref={inputRef}
          className="w-full border border-blue-200 focus:border-blue-400 transition p-3 rounded-lg text-gray-700 resize-none"
          rows="5"
          placeholder="請輸入你的履歷內容..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex gap-4 justify-center">
          <button
            className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition ${
              mode === "improve"
                ? "bg-blue-500 text-white"
                : "bg-white border border-blue-300 text-blue-500"
            }`}
            onClick={() => setMode("improve")}
          >
            優化履歷
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition ${
              mode === "translate-en"
                ? "bg-green-500 text-white"
                : "bg-white border border-green-300 text-green-500"
            }`}
            onClick={() => setMode("translate-en")}
          >
            中翻英
          </button>
        </div>
        <button
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-xl font-bold text-lg transition hover:from-blue-500 hover:to-blue-700 shadow-lg disabled:opacity-60"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              分析中...
            </span>
          ) : (
            "開始分析"
          )}
        </button>
        <div>
          <div className="flex items-center mb-2">
            <label className="block text-gray-600 font-medium flex-1">AI 優化結果</label>
            <button
              className="ml-2 px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition"
              onClick={handleCopy}
              disabled={!outputText}
              title="複製結果"
            >
              複製
            </button>
          </div>
          <textarea
            ref={outputRef}
            className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-700 resize-none"
            rows="5"
            readOnly
            placeholder="AI 回應結果會出現在這裡"
            value={outputText}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
