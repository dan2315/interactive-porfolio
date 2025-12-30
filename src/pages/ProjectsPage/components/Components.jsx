import styles from "../ProjectPage.module.css"
import ReactMarkdown from "react-markdown";

export function ItemContainer (props) {
    return <div className={styles.itemContainer}>{props.children}</div>
}

export function Title(props) {
    return <h1 style={{marginTop: '0px'}}>{props.value}</h1>
}

export function PrideRating(props) {
    return <p>🦁: {props.value}/10</p>
}

export function Technologies(props) {
    return <div>
      {props.value.map(t => (
        <span key={t}>{t} | </span>
      ))}
    </div>
}

export function ShortDescription(props) {
    return <p>{props.value}</p>
    
}

export function Description(props) {
    return <div style={{ width: "50%", borderLeft: "1px solid #ccc", paddingLeft: 12 }}>
        <ReactMarkdown>{props.value}</ReactMarkdown>
    </div>
}

export function RepositoryView({project}) {
    return (
    project.repository && (
    <div style={{ }}>
        <h2 >Repository: {project.repository.name}</h2>
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
        
        {project.repository.readmeMarkdown && (
            <div style={{ marginTop: '15px' }}>
                <h4>README:</h4>
                <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                    {project.repository.readmeMarkdown}
                </pre>
            </div>
        )}
    </div>
))
}

export function ReactionsView({project}) {
    return (
        <div style={{ marginTop: '20px' }}>
            <h3>Reactions:</h3>
            {project.reactions && Object.entries(project.reactions.emojis).map(([emoji, count]) => 
                <span key={emoji} style={{ fontSize: '20px', margin: '0 5px' }}>
                    {emoji} {count}
                </span>
            )}
            {/* <EmojiPicker
                onEmojiClick={(emojiData) => {
                    console.log(project.slug)
                    toggleReaction(project.slug, emojiData.emoji);
                }}
                lazyLoadEmojis
                theme="dark"
            /> */}
        </div>
    )
}