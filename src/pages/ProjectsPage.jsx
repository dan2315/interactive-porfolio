import { useEffect, useState } from "react";
import projectsService from "../services/projectsService";
import EmojiPicker from "emoji-picker-react";

function ProjectsPage() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const doEffect = async () => {
            const projectsRes = await projectsService.getAllProjects();
            setProjects(projectsRes);
        }
        doEffect();
    }, [])

    async function toggleReaction(slug, emoji) {
        const updatedReactions = await projectsService.toggleReaction(slug, emoji)
        setProjects(prevProjects =>
            prevProjects.map(project => {
                if (project.slug === updatedReactions.projectSlug) {
                    return {
                        ...project,
                        reactions: updatedReactions
                    };
                }
                return project;
            })
        );
    }
    
    return (
        <>
        {projects && projects.map(project => 
           <div key={project.slug}>
            <h1>{project.title}</h1>
            <p>{project.shortDescription}</p>
            <p>Pride Rating: {project.prideRating}/10</p>
            
            {/* Repository Information */}
            {project.repository && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h2>Repository: {project.repository.name}</h2>
                    <a href={project.repository.url} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                    </a>
                    {project.repository.description && <p>{project.repository.description}</p>}
                    {project.repository.homepageUrl && (
                        <p>
                            Homepage: <a href={project.repository.homepageUrl} target="_blank" rel="noopener noreferrer">
                                {project.repository.homepageUrl}
                            </a>
                        </p>
                    )}
                    
                    {/* Primary Language */}
                    {project.repository.primaryLanguage && (
                        <div style={{ marginTop: '10px' }}>
                            <span 
                                style={{ 
                                    backgroundColor: project.repository.primaryLanguage.color, 
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    fontSize: '14px'
                                }}
                            >
                                {project.repository.primaryLanguage.name}
                            </span>
                        </div>
                    )}
                    
                    {/* All Languages */}
                    {project.repository.languages && project.repository.languages.length > 1 && (
                        <div style={{ marginTop: '10px' }}>
                            <strong>Languages: </strong>
                            {project.repository.languages.map((lang, idx) => (
                                <span 
                                    key={idx}
                                    style={{ 
                                        backgroundColor: lang.color, 
                                        color: 'white',
                                        padding: '3px 8px',
                                        borderRadius: '3px',
                                        fontSize: '12px',
                                        marginRight: '5px'
                                    }}
                                >
                                    {lang.name}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {/* Recent Commits */}
                    {project.repository.defaultBranchRef && (
                        <div style={{ marginTop: '15px' }}>
                            <h3>Branch: {project.repository.defaultBranchRef.name}</h3>
                            <h4>Recent Commits:</h4>
                            <ul>
                                {project.repository.defaultBranchRef.commits.map((commit) => (
                                    <li key={commit.oid}>
                                        <strong>{commit.message}</strong>
                                        <br />
                                        <small>
                                            {new Date(commit.committedDate).toLocaleString()} - {commit.oid.substring(0, 7)}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* README Preview */}
                    {project.repository.readmeMarkdown && (
                        <div style={{ marginTop: '15px' }}>
                            <h4>README:</h4>
                            <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                                {project.repository.readmeMarkdown}
                            </pre>
                        </div>
                    )}
                </div>
            )}
            
            {/* Reactions */}
            <div style={{ marginTop: '20px' }}>
                <h3>Reactions:</h3>
                {project.reactions && Object.entries(project.reactions.emojis).map(([emoji, count]) => 
                    <span key={emoji} style={{ fontSize: '20px', margin: '0 5px' }}>
                        {emoji} {count}
                    </span>
                )}
                <EmojiPicker
                    onEmojiClick={(emojiData) => {
                        console.log(project.slug)
                        toggleReaction(project.slug, emojiData.emoji);
                    }}
                    lazyLoadEmojis
                    theme="dark"
                />
            </div>
           </div> 
        )}
        </>
    )
}

export default ProjectsPage