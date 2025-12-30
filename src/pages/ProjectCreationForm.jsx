import { useState } from "react";
import EditableElement from "../components/EditableElement";
import { ListInput, PublishToggle, TextareaInput, TextInput } from "../components/InputFields";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { Description, ItemContainer, PrideRating, RepositoryView, ShortDescription, Technologies, Title } from "./ProjectsPage/components/Components";

export default function ProjectCreationForm({ onSubmited }) {
  const [state, setState] = useState({
    title: "Project Name",
    prideRating: 0,
    shortDescription: "A short description of the project...",
    description: "Full project description goes here...",
    technologies: ["Tech1", "Tech2"],
    repositoryURL: "https://github.com/octocat/Hello-World",
    isPublished: false,
  });

  const handleChange = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: state.title,
        prideRating: state.prideRating,
        shortDescription: state.shortDescription,
        description: state.description,
        technologies: state.technologies,
        repositoryURL: state.repositoryURL,
        isPublished: state.isPublished,
      };

      onSubmited(payload);
    } catch (err) {
      console.error(err);
      alert("Failed to create project.");
    }
  };

  return (
    <ItemContainer>
      <EditableElement
        Display={Title}
        displayProps={{ project: state }}
        Input={TextInput}
        value={state.title}
        onSave={(v) => handleChange("title", v)}
      />

      <EditableElement
        Display={PrideRating}
        displayProps={{ project: state }}
        Input={TextInput}
        value={state.prideRating}
        onSave={(v) => handleChange("prideRating", v)}
      />

      <EditableElement
        Display={ShortDescription}
        displayProps={{ project: state }}
        Input={TextareaInput}
        value={state.shortDescription}
        onSave={(v) => handleChange("shortDescription", v)}
      />

      <EditableElement
        Display={Description}
        displayProps={{ project: state }}
        Input={MarkdownEditor}
        value={state.description}
        onSave={(v) => handleChange("description", v)}
      />

      <EditableElement
        Display={Technologies}
        Input={ListInput}
        value={state.technologies}
        onSave={(v) => handleChange("technologies", v)}
      />

      <EditableElement
        Display={RepositoryView}
        displayProps={{ project: state }}
        Input={TextInput}
        value={state.repositoryURL}
        onSave={(v) => handleChange("repositoryURL", v)}
      />

      <PublishToggle
        value={state.isPublished}
        onToggle={() => handleChange("isPublished", !state.isPublished)}
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          borderRadius: "6px",
          background: "#4caf50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Create Project
      </button>
    </ItemContainer>
  );
}