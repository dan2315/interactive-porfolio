import { useAssetManagerContext } from '../contexts/AssetManagerContext';
import { randomInt } from '../utils/random';
import styles from './LoadingScreen.module.css';
import React, { useEffect, useMemo, useState } from "react";
import sprites from '../data/sprites.json';

const fruitIds = [2, 3, 4, 5, 6];
const ghostIds = [7, 8, 9, 10];
const buffId = 11;
const spookenGhostId = 12;
const scoreId = 13;

const ghosts = {min: 0, max: 2};
const fruits = {min: 1, max: 3};

function LoadingScreen() {
    const { totalProgress , isComplete, assets, loadedCount, assetCount } = useAssetManagerContext();
    // const [totalProgress, setTotalProgress] = useState(0);
    // const [isComplete, setIsComplete] = useState(false);

    const [isVisible, setIsVisible] = useState(true);
    const [displayProgress, setDisplayProgress] = useState(0);
    const [tileProgress, setTileProgress] = useState(0);

    const pacmanFrames = [0, 1, 2, 1];
    const tiles = 16;
    const currentFrame = Math.round(displayProgress / ((100 / tiles) / pacmanFrames.length)) % pacmanFrames.length;
    const frameWidth = 64;
    const barWidth = tiles * frameWidth;

    const barObjects = Array(tiles).fill(1);
    const [barObjectsState, setBarObjects] = useState();

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTotalProgress(prev => {
    //             const next = prev + 2;
    //             return Math.min(next, 100);
    //         });
    //         if (totalProgress >= 100) {
    //             setIsComplete(true);
    //         }
    //     }, 100);
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        let rndGhosts = randomInt(ghosts.min, ghosts.max);
        let rndFruits = randomInt(fruits.min, fruits.max);
        const totalSpecialObjects = rndGhosts + rndFruits;
        const range = Math.floor((tiles - 2) / totalSpecialObjects);


        let firstGhost = totalSpecialObjects;
        for (let i = 0; i < totalSpecialObjects; i++) {
            let specialObj = randomInt(1, rndGhosts + rndFruits);
            const rndPos = randomInt(i * range, ((i+1) * range) - 1) + 2;
            if (specialObj > rndGhosts) {
                rndFruits--;
                specialObj = fruitIds[randomInt(0, fruitIds.length - 1)];
            } else {
                rndGhosts--;
                if (firstGhost === totalSpecialObjects) firstGhost = rndPos;
                specialObj = ghostIds[randomInt(0, ghostIds.length - 1)];
            }
            barObjects[rndPos] = specialObj;
        }

        for (let i = firstGhost; i > 0; i--) {
            if (barObjects[i] === 1) {
                barObjects[i] = buffId;
                break;
            }
        }
        
        setBarObjects(barObjects);
    }, [])

    useEffect(() => {
        let rafId;
        const targetProgress = totalProgress;
        const step = () => {
            setDisplayProgress(prev => {
                const diff = targetProgress - prev;
                if (Math.abs(diff) < 0.1) return targetProgress;
                const res = prev + diff * 0.1;
                setTileProgress(tp => {
                    const cur = Math.ceil(res / 100 * tiles);
                    return tp === cur ? tp : cur;
                });
                return res;
            });
            rafId = requestAnimationFrame(step);
        };

        rafId = requestAnimationFrame(step);

        return () => cancelAnimationFrame(rafId);
    }, [totalProgress]);

    useEffect(() => {
        if (totalProgress >= 100 && isComplete) {
            setTimeout(() => {
                setIsVisible(false);
            }, 500);
        }
    }, [totalProgress, isComplete]);

    useEffect(() => {
        setBarObjects(objects => {
            const next = [...objects];
            
            if (next[tileProgress-1] === 11) {
                for (let i = 0; i < next.length; i++)
                {
                    if (ghostIds.includes(next[i])) {
                        next[i] = spookenGhostId;
                    }
                }
            } else if (
                ghostIds.includes(next[tileProgress - 1]) ||
                fruitIds.includes(next[tileProgress - 1]) ||
                spookenGhostId===next[tileProgress - 1]
            ) {
                next[tileProgress-1] = scoreId;
            }
            for (let i = 0; i < tileProgress; i++) {
                if (next[i] !== 0 && next[i] !== scoreId) {
                    next[i] = 0;
                }
            }
            return next;
        })
    }, [tileProgress])



    const Tile = React.memo(({ obj }) => {
        if (obj === 0) {
            return <div className={styles.tile} />;
        }

        if (obj === 1) {
            return (
                <div className={styles.tile}>
                    <div className={styles.dot} />
                </div>
            );
        }

        if (obj === 11) {
            return (
                <div className={styles.tile}>
                    <div className={styles.buff} />
                </div>
            );
        }

        return (
            <div
                className={styles.object}
                style={{
                    backgroundPositionX: -sprites[obj].x * 2,
                    backgroundPositionY: -sprites[obj].y * 2,
                    scale: 0.8
                }}
            />
        );
    });

    const tilesView = useMemo(() => {
        if (!barObjectsState) return null;

        return barObjectsState.map((obj, i) => (
            <Tile key={i} obj={obj} />
        ));
    }, [barObjectsState]);

    return (
        <div className={`${styles.loadingScreen} ${!isVisible ? styles.fadeOut : ""}`}>
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
                        <div className={styles.objectsContainer}>
                            {tilesView}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingScreen;