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
    const { totalProgress , isComplete } = useAssetManagerContext();
    
    const loadingText = "Bringing code to life...";
    const [loadingTextTick, setLoadingTextTick] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [displayProgress, setDisplayProgress] = useState(0);
    const [tileProgress, setTileProgress] = useState(0);

    const pacmanFrames = [0, 1, 2, 1];
    const frameWidth = 64;

    const maxTiles = 24;
    const minTiles = 12;
    const padding = 20;
    const { innerHeight, innerWidth } = window;
    const availableWidth = innerWidth - 2 * padding;
    const maxBarWidth = frameWidth * maxTiles;
    const barWidth = Math.min(availableWidth, maxBarWidth);

    const calculatedTiles = Math.floor(barWidth / frameWidth);
    const tiles = Math.max(calculatedTiles, minTiles);
    const tileWidth = barWidth / tiles;
    const scale = tileWidth/frameWidth;
    const objectScale = 0.8*tileWidth/frameWidth;

    const currentFrame = Math.round((displayProgress+2.5) / ((100 / tiles) / pacmanFrames.length)) % pacmanFrames.length;

    const barObjects = Array(tiles).fill(1);
    const [barObjectsState, setBarObjects] = useState();

    useEffect(() => {
        const id = setInterval(() => {
        setLoadingTextTick(t => (t+1)%loadingText.length);
        }, 200);

        return () => clearInterval(id);
    }, []);

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
                const diff = Math.min(targetProgress - prev, 33);
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
        if (isComplete) {
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
            return <div className={styles.tile} style={{width: `${tileWidth}px`, height: `${tileWidth}px`}} />;
        }

        if (obj === 1) {
            return (
                <div className={styles.tile} style={{width: `${tileWidth}px`, height: `${tileWidth}px`}}>
                    <div className={styles.dot} />
                </div>
            );
        }

        if (obj === 11) {
            return (
                <div className={styles.tile} style={{width: `${tileWidth}px`, height: `${tileWidth}px`}}>
                    <div className={styles.buff} />
                </div>
            );
        }
        
        return (
            <div className={styles.tile} style={{width: `${tileWidth}px`, height: `${tileWidth}px`}}>
            <div
                className={styles.object}
                style={{
                    width: `${0.8*tileWidth}px`,
                    height: `${0.8*tileWidth}px`,
                    backgroundPositionX: -sprites[obj].x * 2 * (objectScale),
                    backgroundPositionY: -sprites[obj].y * 2 * (objectScale),
                    backgroundSize: `${894 * (objectScale)}px ${960 * (objectScale)}px`,
                }}
            />
            </div>
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
            <div className={styles.flexContainer} >
                <div style={{display: "flex", width:`${barWidth}px`, alignItems: "flex-end", justifyContent: 'space-between',}}> 
                    <div style={{ minWidth: 0, flexShrink: 1 }}>
                        <h1 className={styles.writings}>
                            Danil Prokhorenko
                        </h1>
                        <h2 className={styles.writings}>
                            Software Engineer
                        </h2>
                        <h2 className={styles.writings}  style={{fontFamily: `"Fira Code", monospace`,fontWeight: 500}} >
                            <i>{loadingText.slice(0, loadingTextTick) + "▮" + loadingText.slice(loadingTextTick + 1)}</i>
                        </h2>
                    </div>
                    <div style={{height: "fit-content"}}>
                        <h1 className={styles.writings}>{`${Math.round(displayProgress)}%`}</h1>
                    </div>
                </div>
                <div>
                    <div className={styles.loadingBar} style={{
                        width: `${barWidth}px`,
                        height: `${tileWidth}px`
                    }}>
                        <div className={styles.pacman} style={{
                            width: `${tileWidth}px`,
                            height: `${tileWidth}px`,
                            backgroundSize: `${894 * scale}px ${960 * scale}px`,
                            backgroundPositionX: `-${pacmanFrames[currentFrame] * frameWidth * scale}px`,
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