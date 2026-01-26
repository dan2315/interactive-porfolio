import styles from "./AnalyricsPage.module.css"
import { useEffect, useState } from "react";
import { analytics } from "../../services/analytics";
import LiveAnalyticsGraph from "./components/LiveAnalyticsGraph";
import MultiRangeSlider from "../../components/MultiRangeSlider";

const MAX_MINUTES = 8 * 60; // 480
const STEP = 5;

const HOUR_TICKS = Array.from({ length: 8 }, (_, i) => {
  const h = i + 1;
  return {
    value: h * 60,
    label: `${h}h`,
  };
});
HOUR_TICKS.reverse();
HOUR_TICKS.push({value: 0, label: "now"});

function AnalyticsPage() {
  const [sessions, setSessions] = useState();
  const [selectedRange, setSelectedRange] = useState([HOUR_TICKS[0], HOUR_TICKS[HOUR_TICKS.length - 1]]);

  useEffect(() => {
    async function doTheThing(params) {
      const sessions = await analytics.getLiveAnalytics()
      console.log(sessions)
      setSessions(sessions)
    }

    doTheThing();
  }, [])

  return (
    <>
      <div className={styles.leveSessionsContainer}>
        <h2>Live Sessions</h2>
        <MultiRangeSlider
          min={0}
          max={MAX_MINUTES}
          step={STEP}
          ticks={HOUR_TICKS}
          onChange={({ min, max }) => setSelectedRange([MAX_MINUTES-min, MAX_MINUTES-max])}
        />
        {sessions && <LiveAnalyticsGraph sessionsData={sessions} timeRange={selectedRange}/>}
      </div>
    </>
  );
}



export default AnalyticsPage;
