import { useAssetManagerContext } from '../contexts/AssetManagerContext';
import styles from './LoadingScreen.module.css';
import { useEffect, useState } from "react";

function LoadingScreen() {
    const { totalProgress , isComplete, assets, loadedCount, assetCount } = useAssetManagerContext();
    // const [totalProgress, setTotalProgress] = useState(0);
    // const [isComplete, setIsComplete] = useState(false);

    const [isVisible, setIsVisible] = useState(true);
    const [displayProgress, setDisplayProgress] = useState(0);

    const pacmanFrames = [0, 1, 2, 1];
    const loadingBarLengthInTiles = 12;
    const currentFrame = Math.round(displayProgress / ((100 / loadingBarLengthInTiles) / pacmanFrames.length)) % pacmanFrames.length;
    const frameWidth = 64;
    const barWidth = loadingBarLengthInTiles * frameWidth;
    // console.log("Progress:", totalProgress, "Loaded:", loadedCount, "of", assetCount);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTotalProgress(prev => {
    //             const next = prev + 12;
    //             return Math.min(next, 100);
    //         });
    //         if (totalProgress >= 100) {
    //             setIsComplete(true);
    //         }
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        const targetProgress = totalProgress;
        const step = () => {
            setDisplayProgress(prev => {
                const diff = targetProgress - prev;
                if (Math.abs(diff) < 0.1) return targetProgress;
                return prev + diff * 0.1;
            });
        };

        const interval = setInterval(step, 16);
        return () => clearInterval(interval);
    }, [totalProgress]);

    useEffect(() => {
        if (totalProgress === 100 && isComplete) {
            setIsVisible(false);
        }
    }, [totalProgress, isComplete]);

    if (!isVisible) return null;

    return (
        <div className={styles.loadingScreen}>
            <div className={styles.flexContainer} style={{ width: `${barWidth + 20}px` }}>
                <h1 className={styles.writings}>
                    Danil Prokhorenko
                </h1>
                <h2 className={styles.writings}>
                    Software Engineer
                </h2>
                <p className={styles.writings}>
                    Bringing code to life...
                </p>
                <div>
                    <div className={styles.loadingBar} style={{
                        width: `${barWidth}px`
                    }}>
                    <div className={styles.pacman} style={{
                        backgroundPositionX: `-${pacmanFrames[currentFrame] * frameWidth}px`,
                        left: `${barWidth * displayProgress/100}px`
                    }}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingScreen;