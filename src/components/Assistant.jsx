import styles from './Assistant.module.css'
import useTypewriter from '../hooks/useTypeWriter';
import { useAssistant } from '../hooks/useAssistant';
import { assistant } from '../stores/AssistantStore';

function Assistant( { speed = 30 } ) {
    const { text, visible } = useAssistant();
    const typed = useTypewriter(text);
    
    return (
        <div onClick={assistant.showNext} className={`${styles.assistantUi} ${visible ? styles.visible : ''}`}>
            <div className={styles.assistantBubble}>
                {typed}
            </div>
            <img
                className={styles.assistantImage}
                alt="assistant"
                src="/images/assistant.png"
            />
        </div>
    )
}

export default Assistant;
