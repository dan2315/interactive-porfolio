import { useState } from "react";

function EditableElement({
  value,
  onSave,
  Display,
  displayProps,
  Input,
  isEditMode: controlledEdit,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [draft, setDraft] = useState(value);

  const editMode = controlledEdit ?? isEdit;

  const enterEdit = () => {
    setDraft(value);
    setIsEdit(true);
  };

  const cancel = () => {
    setDraft(value);
    setIsEdit(false);
  };

  const submit = async () => {
    if (draft !== value) {
      await onSave(draft);
    }
    setIsEdit(false);
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {!editMode ? (
        <Display value={value} onEdit={enterEdit} {...displayProps}/>
      ) : (
        <Input
          value={draft}
          setValue={setDraft}
          onSubmit={submit}
          onCancel={cancel}
        />
      )}

      {!editMode ? (
        <button onClick={enterEdit}>✏️</button>
      ) : (
        <button onClick={submit}>✅</button>
      )}
    </div>
  );
}

export default EditableElement;
