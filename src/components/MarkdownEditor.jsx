import { Description } from "../pages/ProjectsPage/components/Components";

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

      <Description value ={value}/>

    </div>
  );
}
