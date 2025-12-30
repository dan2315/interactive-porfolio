import { useEffect, useRef, useState } from "react";

export function TextInput({ value, setValue, onSubmit, onCancel }) {

  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        onSubmit?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          onCancel?.();
        }
      }}
    />
  );
}

export function TextareaInput({ value, setValue, onSubmit, onCancel }) {
  return (
    <textarea
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        onSubmit?.();
      }}
      onKeyDown={(e) => {
        // Ctrl+Enter or Cmd+Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.currentTarget.blur();
        }

        if (e.key === "Escape") {
          onCancel?.();
        }
      }}
      rows={4}
      style={{ resize: "vertical" }}
    />
  );
}

export function ListInput({ value = [], setValue, onSubmit, onCancele }) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (!v || value.includes(v)) return;

    setValue([...value, v]);
    setInput("");
  };

  const remove = (tech) => {
    setValue(value.filter(t => t !== tech));
  };

  return (
    <div className="tech-input">
      <div className="tech-list">
        {value.map(tech => (
          <span key={tech} className="tech">
            {tech}
            <button onClick={() => remove(tech)}>❌</button>
          </span>
        ))}
      </div>

      <div className="tech-add">
        <input
          value={input}
          placeholder="Add technology"
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
        />
        <button onClick={add}>➕</button>
      </div>
    </div>
  );
}


export function PublishToggle({ value, onToggle }) {
  return (
    <button onClick={onToggle}>
      {value ? "🟢 Published" : "⚪ Draft"}
    </button>
  );
}
