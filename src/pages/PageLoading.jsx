import styles from "./PageLoading.module.css";

export default function PageLoading({ cols = 5, rows = 5 }) {
  const cubes = Array.from({ length: cols * rows });

  return (
    <div 
      className={styles.container}
    >
      <div 
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${cols}, 60px)`,
        gridTemplateRows: `repeat(${rows}, 60px)`,
      }} 
      >
      {cubes.map((_, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;
        const phase = row + col;
        const maxPhase = (rows - 1) + (cols - 1);

        return (
          <div
            key={idx}
            className={styles.cube}
            style={{ animationDelay: `-${(maxPhase - phase) * 0.1}s` }}
          >
            <div className={`${styles.cubeFace} ${styles.front}`}></div>
            <div className={`${styles.cubeFace} ${styles.back}`}></div>
            <div className={`${styles.cubeFace} ${styles.left}`}></div>
            <div className={`${styles.cubeFace} ${styles.right}`}></div>
            <div className={`${styles.cubeFace} ${styles.top}`}></div>
            <div className={`${styles.cubeFace} ${styles.bottom}`}></div>
          </div>
        );
      })}
      </div>
      <div className={styles.loadingText}>
        Loading...
      </div>

    </div>
  );
}
