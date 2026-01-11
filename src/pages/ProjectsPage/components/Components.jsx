/* eslint-disable jsx-a11y/alt-text */
import styles from "../ProjectPage.module.css"
import ReactMarkdown from "react-markdown";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { emojiToUnified, emojiUrlByUnified } from "../../../utils/emoji";


export function ItemContainer (props) {
    return <div className={styles.itemContainer} onClick={props.onClick}>{props.children}</div>
}

export function Title(props) {
    return <h2 style={{margin: '5px'}}>{props.value}</h2>
}

export function PrideRating(props) {
    return <p>
    <img 
        style={{width: 16}}
        src={emojiUrlByUnified(emojiToUnified("🏆"))} 
        alt={"🏆"} 
    />
    : {props.value}/10</p>
}

export function Technologies(props) {
    return <div>
      {props.value.map(t => (
        <span className={styles.techItem} key={t}>{t} </span>
      ))}
    </div>
}

export function ShortDescription(props) {
    return <p>{props.value}</p>
    
}

export function Description(props) {
    return <div style={{ width: "100%", borderLeft: "1px solid #ccc", paddingLeft: 12 }}>
        <ReactMarkdown
            components={{
                img: ({...props}) => {
                    return <MarkdownImage {...props}/>
                }
            }}
        >{props.value}</ReactMarkdown>
    </div>
}

function MarkdownImage(props) {
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        console.log("ASDASDASD!!!!!!!!!!!!!", opened)
    }, [opened])

    return <>
        <img 
            onClick={() => {
                setOpened(true)
            }
        }
            className={styles.imageMarkdown}
            {...props}
        />
        {opened &&
         <img
            onClick={() => setOpened(false)}
            className={styles.fullScreenImage}
            {...props}
        />}
    </>
}

function parseForSrcs(text) {
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];

  let match;
  while ((match = regex.exec(text)) !== null) {
    images.push({
      alt: match[1] || "",
      src: match[2],
    });
  }

  return images;
}

export function ImagesRow({ n, ...props }) {
    const imgSrcs = parseForSrcs(props.value).slice(0, n ?? 10);;

    if (imgSrcs.length === 0) return null;

    return (
        <>
        {imgSrcs.map((image, i) => {
            return <img
                key={i}
                alt={image.alt}
                src={image.src}
                className={styles.imageFromPreview}
            />
        })}
        </>
    )
}

export function RepositoryView({project}) {
    return (
    project.repository && (
    <div>
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

export function ReactionsView({project, toggleReaction}) {
    const [chosingReaction, setChosingReaction] = useState();
    return (
        <div className={styles.reactionsContainer} style={{ marginTop: '20px', position: "relative"}}>
            <i>Reactions:</i>
            {project.reactions && Object.entries(project.reactions.emojis).map(([emoji, count]) => 
                <span 
                    key={emoji} 
                    className={[
                            styles.reactionContainer,
                            emoji === project.reactions.selectedEmoji && styles.selectedReaction
                        ].filter(Boolean).join(" ")}
                    onClick={(e) => {toggleReaction(project.slug, emoji); e.stopPropagation();}}
                >
                    <img 
                        className={styles.reactionContainerImage} 
                        src={emojiUrlByUnified(emojiToUnified(emoji))} 
                        alt={emoji} 
                    /> {count}
                </span>
            )}
            <span 
                className={styles.reactionContainer} 
                style={{ fontSize: 14, alignSelf: "stretch" }}
                onClick={(e) => {setChosingReaction(!chosingReaction); e.stopPropagation();}}
            >
                <b>Add</b>
            </span>
            {chosingReaction && <EmojiPicker
                onEmojiClick={(emojiData) => {
                    toggleReaction(project.slug, emojiData.emoji);
                    setChosingReaction(false);
                }}
                style={{ position: "absolute", zIndex: 10, transform: "translateY(55%)" }}
                lazyLoadEmojis
                theme="dark"
            />}
        </div>
    )
}