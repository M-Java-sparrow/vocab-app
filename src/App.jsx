import { useState, useEffect } from "react";
import AddWordForm from "./components/AddWordForm";
import WordList from "./components/WordList";

const STORAGE_KEY = "vocab-words";

// 🔁 日付のN日後を文字列で返す関数
function getNextDate(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString().split("T")[0];
}

function App() {
  const [words, setWords] = useState([]);

  // 🔁 初期化：localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setWords(JSON.parse(saved));
    }
  }, []);

  // 💾 保存：単語が変わるたびに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }, [words]);

  // ➕ 単語を追加
  const handleAddWord = (word) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    setWords([
      ...words,
      {
        ...word,
        status: "unknown",
        lastReviewed: todayStr,
        interval: 1,
        nextReview: getNextDate(today, 1),
      },
    ]);
  };

  // ✅❌ ステータス更新＆復習間隔更新
  const handleUpdateStatus = (index, newStatus) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const updated = [...words];
    const word = updated[index];

    const currentInterval = word.interval || 1;
    const newInterval = newStatus === "known" ? currentInterval * 2 : 1;

    updated[index] = {
      ...word,
      status: newStatus,
      lastReviewed: todayStr,
      interval: newInterval,
      nextReview: getNextDate(today, newInterval),
    };

    setWords(updated);
  };

  // 📅 今日出すべき単語のみ抽出
  const todayStr = new Date().toISOString().split("T")[0];
  const dueWords = words.filter((word) => word.nextReview <= todayStr);

  return (
    <div>
      <h1>英単語帳</h1>
      <AddWordForm onAdd={handleAddWord} />
      {dueWords.length === 0 ? (
        <p>今日の復習は完了しました！🎉</p>
      ) : (
        <WordList words={dueWords} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
}

export default App;
