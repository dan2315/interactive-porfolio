import { useEffect, useState } from "react";
import projectsService from "../services/projectsService";
import ProjectEditor from "./ProjectEditor";
import ProjectCreationForm from "./ProjectCreationForm";
import PageLoading from "./PageLoading";

export default function EditProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [creatingNew, setCreatingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsService.public.getAll();
      setProjects(data);
    } catch (e) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (project) => {
    const result = await projectsService.admin.create(project);
    console.log(result)
    setCreatingNew(false);
    loadProjects();
  }

  const handleUpdate = async (project, patch) => {
    const updatedProject = await projectsService.admin.update(project.id, patch);
    setProjects(projects => {
      return projects.map(p => p.id === updatedProject.id ? updatedProject : p)
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await projectsService.admin.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError("Failed to delete project");
    }
  };

  const startEdit = (id) => {
    setEditingId(id);
  };

  const stopEdit = () => {
    setEditingId(null);
    loadProjects();
  };

  if (loading) return <PageLoading/>;

  return (
    <div style={{overflowY: "scroll", padding:"20px"}}>
      <h2>Projects</h2>
      <button onClick={() => setCreatingNew(!creatingNew)}>
        {creatingNew ? "Cancel Creation" :"Create New"}
      </button>
      {creatingNew && <ProjectCreationForm project={{}} onSubmited={handleCreate}/> }
      {error && <p style={{ color: "darkred" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {projects.map((project) => (
          <li
            key={project.id}
            style={{
              marginBottom: 16,
              padding: 12,
              border: "1px solid #ccc",
              borderRadius: 6,
            }}
          >
            {editingId === project.id ? (
              <div>
                <ProjectEditor project={project} onUpdated={handleUpdate}/>
                <button onClick={stopEdit}>Done Editing</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: "bold" }}>{project.title}</span>
                <button onClick={() => startEdit(project.id)}>Edit</button>
                <button onClick={() => handleDelete(project.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
