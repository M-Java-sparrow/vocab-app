import { useState } from "react";

export default function AddWordForm({ onAdd }) {
  const [english, setEnglish] = useState("");
  const [japanese, setJapanese] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!english || !japanese) return;
    onAdd({ english, japanese });
    setEnglish("");
    setJapanese("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="English"
        value={english}
        onChange={(e) => setEnglish(e.target.value)}
      />
      <input
        placeholder="日本語"
        value={japanese}
        onChange={(e) => setJapanese(e.target.value)}
      />
      <button type="submit">追加</button>
    </form>
  );
}
