import styles from './LoadingScreen.module.css';

function LoadedModal( {handleContinue} ) {
    return <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <h1 className={styles.writings}>
                Danil Prokhorenko
            </h1>
            <h2 className={styles.writings}>
                Software Engineer
            </h2>
            <div className={styles.writings} style={{fontSize: '24px'}}>
                It's recommended to enter fullscreen mode <b>[Press <span className={styles.keycap}>F11</span>]</b> to improve experience.
            </div>
            <button className={styles.button} onClick={handleContinue}>
                Continue
            </button>
        </div>
    </>
}

export default LoadedModal;