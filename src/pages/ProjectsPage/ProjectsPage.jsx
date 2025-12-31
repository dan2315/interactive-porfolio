import styles from './ProjectPage.module.css'
import { useEffect, useState } from "react";
import projectsService from "../../services/projectsService";
import { ImagesRow, ItemContainer, PrideRating, ReactionsView, ShortDescription, Technologies, Title } from './components/Components';
import PageLoading from '../PageLoading';

function ProjectsPage() {
    const [projects, setProjects] = useState(null);

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
    
    if (!projects) return <PageLoading/>;

    return (
        <div className={styles.container}>
            {projects && projects.map(project => 
            <ItemContainer key={project.slug}>
                    <Title value={project.title}/>
                    <Technologies value={project.technologies} />
                    <PrideRating value={project.prideRating}/>
                    <ShortDescription value={project.shortDescription}/>
                    <ImagesRow value={project.description}/>
                    <ReactionsView project={project} toggleReaction={toggleReaction}/>
            </ItemContainer>
            )}
        </div>
    )
}

export default ProjectsPage