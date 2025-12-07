import { useProgress } from "@react-three/drei";
import styles from './LoadingScreen.module.css';
import { useEffect, useState } from "react";

function LoadingScreen() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    const [isVisible, setIsVisible] = useState(true);
    const [displayProgress, setDisplayProgress] = useState(0);

    const frameCount = 4;
    const currentFrame = Math.min(Math.floor((progress / 100) * frameCount), frameCount - 1);
    const frameWidth = 32;
    const loadingBarLengthInTiles = 12;

    console.log(`Loading item: ${progress} ${item} (${loaded} of ${total} bytes loaded)`);

    useEffect(() => {
        const targetProgress = progress;
        const step = () => {
            setDisplayProgress(prev => {
                const diff = targetProgress - prev;
                if (Math.abs(diff) < 0.1) return targetProgress;
                return prev + diff * 0.1;
            });
        };

        const interval = setInterval(step, 16);
        return () => clearInterval(interval);
    }, [progress]);

    useEffect(() => {
        if (progress === 100 && !active) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [progress, active]);

    if (!isVisible) return null;

    return (
        <div className={styles.loadingScreen}>
            <h1>
                Danil Prokhorenko
            </h1>
            <h2>
                Software Engineer
            </h2>
            <p>
                Bringing code to life... {displayProgress}%
            </p>
            <div>
                <div className={styles.loadingBar}>
                    <div className={styles.loadingBarFill} style={{width: `${(progress / 100) * loadingBarLengthInTiles * frameWidth}px`}}/>
                </div>
                <div className={styles.pacman} style={{backgroundPositionX: `-${currentFrame * frameWidth}px`}}/>
            </div>
        </div>
    );
}

export default LoadingScreen;