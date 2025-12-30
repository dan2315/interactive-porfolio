import styles from './ProjectPage.module.css'
import { useEffect, useState } from "react";
import projectsService from "../../services/projectsService";
import EmojiPicker from "emoji-picker-react";
import { Description, ItemContainer, PrideRating, ReactionsView, RepositoryView, ShortDescription, Technologies, Title } from './components/Components';

function ProjectsPage() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const doEffect = async () => {
            const projectsRes = await projectsService.public.getAll();
            setProjects(projectsRes);
        }
        doEffect();
    }, [])

    async function toggleReaction(slug, emoji) {
        const updatedReactions = await projectsService.public.toggleReaction(slug, emoji)
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
        <div className={styles.container}>
        {projects && projects.map(project => 
           <ItemContainer key={project.slug}>
            <Title value={project.title}/>
            <Technologies value={project.technologies} />
            <PrideRating value={project.prideRating}/>
            <ShortDescription value={project.shortDescription}/>
            <Description value={project.description}/>
            <RepositoryView project={project}/>
            <ReactionsView project={project}/>
           </ItemContainer> 
        )}
        </div>
    )
}

export default ProjectsPage