import { useState, useEffect } from "react";

// 🔁 日付のN日後を返す
function getNextDate(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString().split("T")[0];
}

function App() {
  const STORAGE_KEY = "vocab-words";

  const [words, setWords] = useState([]);
  const [newEnglish, setNewEnglish] = useState("");
  const [newJapanese, setNewJapanese] = useState("");

  // 初回ロード：保存データ読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setWords(JSON.parse(saved));
    }
  }, []);

  // 保存：words変更時に保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }, [words]);

  // 単語追加
  const handleAddWord = (word) => {
    const today = new Date().toISOString().split("T")[0];
    setWords([
      ...words,
      {
        ...word,
        status: "unknown",
        lastReviewed: today,
        interval: 1,
        nextReview: today,
      },
    ]);
  };

  // フォーム送信処理
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEnglish.trim() || !newJapanese.trim()) return;
    handleAddWord({
      english: newEnglish.trim(),
      japanese: newJapanese.trim(),
    });
    setNewEnglish("");
    setNewJapanese("");
  };

  // ステータス更新
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

  // 📅 今日出すべき単語のみを抽出（本番時はこれを使う）
  // const todayStr = new Date().toISOString().split("T")[0];
  // const dueWords = words.filter((word) => word.nextReview <= todayStr);

  // 🔧 開発中はすべて表示
  const dueWords = words;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>英単語帳</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="English"
          value={newEnglish}
          onChange={(e) => setNewEnglish(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="日本語訳"
          value={newJapanese}
          onChange={(e) => setNewJapanese(e.target.value)}
          required
        />
        <button type="submit">追加</button>
      </form>

      <hr />

      {dueWords.length === 0 ? (
        <p>表示する単語がありません。</p>
      ) : (
        dueWords.map((word, index) => {
          const cardStyle = {
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor:
              word.status === "known"
                ? "#d2ffd2"
                : word.status === "unknown"
                ? "#ffd2d2"
                : "#fff",
            cursor: "pointer",
          };

          return (
            <div
              key={index}
              style={cardStyle}
              onClick={() => {
                const newWords = [...words];
                newWords[index].showMeaning = !newWords[index].showMeaning;
                setWords(newWords);
              }}
            >
              <h3>{word.english}</h3>
              {word.showMeaning && (
                <>
                  <p>{word.japanese}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(index, "known");
                    }}
                  >
                    ✅ 知ってた
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(index, "unknown");
                    }}
                  >
                    ❌ 知らなかった
                  </button>
                  <p>状態: {word.status}</p>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
