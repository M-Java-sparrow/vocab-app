import React, { useState } from "react";

function WordCard({ word, index, onUpdateStatus }) {
  const [showMeaning, setShowMeaning] = useState(false);

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
      style={cardStyle}
      onClick={() => setShowMeaning(!showMeaning)}
    >
      <h3>{word.english}</h3>
      {showMeaning && (
        <>
          <p>{word.japanese}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(index, "known");
            }}
          >
            ✅ 知ってた
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(index, "unknown");
            }}
          >
            ❌ 知らなかった
          </button>
          <p>状態: {word.status}</p>
        </>
      )}
    </div>
  );
}

export default WordCard;
