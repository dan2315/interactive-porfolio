import styles from './ProjectPage.module.css'
import { useEffect, useState } from "react";
import projectsService from "../../services/projectsService";
import { ImagesRow, ItemContainer, PrideRating, ReactionsView, ShortDescription, Technologies, Title } from './components/Components';
import PageLoading from '../PageLoading';
import { useRouteStore } from '../../stores/RouteStore';
import DetailedProjectView from './components/DetailedProjectView';

function ProjectsPage() {
    const [projects, setProjects] = useState(null);
    const [selectedProject, setSelectedProject] = useState();
    const route = useRouteStore(s => s.route);
    const navigate = useRouteStore(s => s.setRoute);

    useEffect(() => {
        const doEffect = async () => {
            const projectsRes = await projectsService.public.getAll();
            setProjects(projectsRes);
        }
        doEffect();
    }, [])

    useEffect(() => {
        const parts = route?.split('/');
        const projectSlug = parts?.[3];

        
        if (projectSlug) {
            const project = projects.find(p => p.slug === projectSlug);
            setSelectedProject(project);
        }
    }, [projects, route])

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
        <>
        <div className={styles.container}>
            {projects && projects.map(project => 
            <ItemContainer key={project.slug} onClick={() => navigate(`/main/projects/${project.slug}`)}>
                    <Title value={project.title}/>
                    <Technologies value={project.technologies} />
                    <PrideRating value={project.prideRating}/>
                    <ShortDescription value={project.shortDescription}/>
                    <ImagesRow value={project.description}/>
                    <ReactionsView project={project} toggleReaction={toggleReaction}/>
            </ItemContainer>
            )}
        </div>
        <DetailedProjectView project={selectedProject} back={() => {setSelectedProject(null); navigate("/main/projects")}} toggleReaction={toggleReaction}/>
        </>
    )
}

export default ProjectsPage