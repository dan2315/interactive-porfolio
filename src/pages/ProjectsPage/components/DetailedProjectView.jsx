import { Description, ReactionsView, RepositoryView, Technologies, Title } from "./Components";
import styles from "./DetailedProjectView.module.css"

function DetailedProjectView({ project, back }) {
    if (!project) return;

    return (
        <div className={styles.dimArea}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Title value={project.title}/>
                    <div className={styles.backButton} onClick={back}>
                        ⬅️
                    </div>
                </div>
                <div className={styles.restOfTheContent}>
                    <Technologies value={project.technologies} />
                    <Description value={project.description}/>
                    <RepositoryView  project={project}/>
                </div>
            </div>
        </div>
    )
}

export default DetailedProjectView;