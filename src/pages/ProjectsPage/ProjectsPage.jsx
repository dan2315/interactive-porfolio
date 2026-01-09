import styles from './ProjectPage.module.css'
import { useEffect, useRef, useState } from "react";
import projectsService from "../../services/projectsService";
import { ImagesRow, ItemContainer, PrideRating, ReactionsView, ShortDescription, Technologies, Title } from './components/Components';
import PageLoading from '../PageLoading';
import { useRouteStore } from '../../stores/RouteStore';
import DetailedProjectView from './components/DetailedProjectView';
import { FaArrowDown, FaArrowUp, FaSearch } from 'react-icons/fa';
import useProjectsData from '../../hooks/useProjectsData';

function ProjectsPage() {
    const { data: projectsData, isLoading } = useProjectsData();
    const [projects, setProjects] = useState(projectsData);
    const [selectedProject, setSelectedProject] = useState();
    const [filterTechs, setFilterTechs] = useState([]);
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const route = useRouteStore(s => s.route);
    const navigate = useRouteStore(s => s.setRoute);
    const sortDropdown = useRef();

    console.log("ABOBOBOBABA", projectsData)
    useEffect(() => {
        if (projectsData) setProjects(projectsData);
    }, [projectsData]);

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

    const allTechnologies = Array.from(
      new Set(projects.flatMap(p => p.technologies))
    ).sort();
    const filteredProjects = projects
    .filter(project => {
        if (filterTechs.length > 0) {
        return filterTechs.every(t => project.technologies.includes(t));
        }
        return true;
    })
    .filter(project => {
        if (searchQuery) {
        return project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    })
    .sort((a, b) => {
        if (!sortBy) return 0;
        let aVal, bVal;
        if (sortBy === 'reactions') {
            aVal = Object.values(a.reactions?.emojis || {}).reduce((sum, c) => sum + c, 0);
            bVal = Object.values(b.reactions?.emojis || {}).reduce((sum, c) => sum + c, 0);
        } else if (sortBy === 'pride') {
            aVal = a.prideRating;
            bVal = b.prideRating;
        } else if (sortBy === 'recent') {
            aVal = new Date(a.createdAt);
            bVal = new Date(b.createdAt);
        }

        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    const toggleTech = (tech) => {
        setFilterTechs(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech]
        );
    };

    console.log("drop", sortDropdown.current)

    return (
        <>
        <div className={styles.filterContainer}>
            <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon}/>
                <input
                    className={styles.searchInput}
                    type="text" 
                    placeholder="Search projects..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            <div className={styles.dropdown}>
                <button
                    className={styles.dropdownButton}
                    onClick={() => setOpen(o => !o)}
                >
                    {filterTechs.length
                        ? `Filter by Technologies (${filterTechs.length})`
                        : 'Filter by Technologies'}
                </button>

                {open && (
                    <div className={styles.dropdownMenu}>
                        {allTechnologies.map(tech => (
                            <label key={tech} className={styles.option}>
                                <input
                                    type="checkbox"
                                    checked={filterTechs.includes(tech)}
                                    onChange={() => toggleTech(tech)}
                                />
                                <span>{tech}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.sortBar}>
                <span style={{ backgroundColor: "blanchedalmond", padding: "0px 6px", border:"#ccc solid 2px", borderWidth: "2px 0px 2px 2px", borderRadius:"10px 0px 0px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                        Sort by:
                    </div>
                </span>
                <select className={styles.sortDropdown} value={sortBy || ''} onChange={e => setSortBy(e.target.value)}>
                    <option value="">None</option>
                    <option value="reactions">Reactions</option>
                    <option value="pride">Pride Rating</option>
                </select>

                <button className={styles.sortButton} disabled={!sortBy} onClick={e => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} style={{aspectRatio: "1/1"}}>
                    {sortOrder === "asc" ? <FaArrowUp/> : <FaArrowDown/>}
                </button>
            </div>
        </div>
        <div className={styles.container}>
            <div className={styles.innerContainer}>
            {filteredProjects.map(project => 
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
        </div>
        <DetailedProjectView project={selectedProject} back={() => {setSelectedProject(null); navigate("/main/projects")}} toggleReaction={toggleReaction}/>
        </>
    )
}

export default ProjectsPage