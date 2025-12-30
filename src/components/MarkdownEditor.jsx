import ReactMarkdown from "react-markdown";

export function MarkdownEditor({ value, setValue, onSubmit, onCancel }) {

  return (
    <div style={{ width: "100%" ,display: "flex", gap: 16 }}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "50%", height: 200 }}
        onBlur={onSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) e.currentTarget.blur();
          if (e.key === "Escape") {
            onCancel();
          }
      }}
      />

      <div style={{ width: "50%", borderLeft: "1px solid #ccc", paddingLeft: 12 }}>
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    </div>
  );
}
