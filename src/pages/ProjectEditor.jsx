import EditableElement from "../components/EditableElement";
import { ListInput, PublishToggle, TextareaInput, TextInput } from "../components/InputFields";
import { MarkdownEditor } from "../components/MarkdownEditor";
import projectsService from "../services/projectsService";
import { Description, ItemContainer, PrideRating, RepositoryView, ShortDescription, Technologies, Title } from "./ProjectsPage/components/Components";

export default function ProjectEditor({ project, onUpdated }) {
  const update = (patch) => {
    onUpdated(project, patch);
  }

  return (
    <ItemContainer>
      <EditableElement
        Display={Title}
        displayProps={{project}}
        Input={TextInput}
        value={project.title}
        onSave={(v) => update({ title: v })}
      />

      <EditableElement
        Display={PrideRating}
        displayProps={{project}}
        Input={TextInput}
        value={project.prideRating}
        onSave={(v) => update({ prideRating: v })}
      />

      <EditableElement
        Display={ShortDescription}
        displayProps={{project}}
        Input={TextareaInput}
        value={project.shortDescription}
        onSave={(v) => update({ shortDescription: v })}
      />

      <EditableElement
        Display={Description}
        displayProps={{project}}
        Input={MarkdownEditor}
        value={project.description}
        onSave={(v) => update({ description: v })}
      />

      <EditableElement
        Display={Technologies}
        Input={ListInput}
        value={project.technologies}
        onSave={(v) => update({ technologies: v })}
      />

      <EditableElement
        Display={RepositoryView}
        displayProps={{project}}
        Input={TextInput}
        value={project.repository?.url}
        onSave={(v) => update({ repositoryURL: v })}
      />

      <PublishToggle
        value={project.isPublished}
        onToggle={() =>
          projectsService.admin.togglePublish(project.id)
        }
      />
    </ItemContainer>
  );
}
