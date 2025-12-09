import styles from "./ExperiencePage.module.css"
import data from "../data/experiences.json"

export default function ExperiencePage() {
    return (
        <div className={styles.pageContainer}>
            <h1>Experiences</h1>
            {data.experiences.map((exp, i) => 
            <div>
                <h2 className={styles.header} style={{marginTop: i === 0 ? "10px" : "60px"}}>
                    {exp.title}
                </h2>
                <h3 className={styles.header}>
                    {exp.company} • {exp.employmentType}
                </h3>
                <h3 className={styles.header}>
                    {exp.startDate} ‣ {exp.endDate} • {exp.duration}
                </h3>
                <div className={styles.experiencesRow}>
                    {exp.technologies.map((t, i) => 
                        <span key={i}>{t}{i < exp.technologies.length - 1 && <>&nbsp;•&nbsp;</>}</span>
                    )}
                </div>
                <div className={styles.highlights}>
                    {exp.highlights.map(h => 
                        <div>⁍ {h}</div>
                    )}
                </div>
            </div>)}
        </div>
    );
};