import { useState } from "react";

export default function WordList({ words, onUpdateStatus }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {words.map((word, index) => (
        <WordCard
          key={index}
          word={word}
          index={index}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </ul>
  );
}

function WordCard({ word, index, onUpdateStatus }) {
  const [showMeaning, setShowMeaning] = useState(false);

  const toggleMeaning = () => {
    setShowMeaning(!showMeaning);
  };

  return (
    <li
      onClick={toggleMeaning}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "12px 0",
        cursor: "pointer",
        background: "#f9f9f9",
      }}
    >
      <strong>{word.english}</strong>
      {showMeaning && (
        <>
          <div style={{ marginTop: "8px" }}>{word.japanese}</div>
          <div style={{ marginTop: "12px" }}>
            <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(index, "known"); }}>
              ✅ 知ってた
            </button>
            <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(index, "unknown"); }}>
              ❌ 知らなかった
            </button>
          </div>
        </>
      )}
    </li>
  );
}
