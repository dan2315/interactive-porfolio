import styles from "./AnalyricsPage.module.css"
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { analytics } from "../../services/analytics";
import LiveAnalyticsGraph from "./components/LiveAnalyticsGraph";
import MultiRangeSlider from "../../components/MultiRangeSlider";
import HeatMap from "@uiw/react-heat-map";

const MAX_MINUTES = 8 * 60; //8h
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
  const [sessionsMap, setSessionsMap] = useState(new Map());
  const [selectedRange, setSelectedRange] = useState([HOUR_TICKS[0], HOUR_TICKS[HOUR_TICKS.length - 1]]);

  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef();

  function normalizePipedSession(piped) {
    const startTime = new Date(piped.leastStartTimeUnixMs);
    const endTime = new Date(piped.greatestEndTimeUnixMs);

    return {
      sessionId: piped.sessionId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      pagesViewed: piped.pagesViewed,
      cartridgesInserted: piped.cartridgesInserted,
      contactAttempted: piped.contactAttempts,
      totalTimeMs: endTime - startTime,
      anonymousId: piped.anonymousId,
      sessionExpiresAtUnixMs: piped.sessionExpiresAtUnixMs
    };
  }

  useEffect(() => {
    let mounted = true;

    async function doTheThing() {
      const rawSessions = await analytics.getLiveAnalytics();
      console.log(rawSessions);
      const map = new Map(rawSessions.map(s => [s.sessionId, s]));
      setSessionsMap(map);
    }

    const connection = analytics.connectToEventsPipe();
    console.log(connection)
    async function startConnection() {
      if (connection.state === "Disconnected") {
        try {
          await connection.start();
          await connection.invoke("Subscribe");

          connection.on("SessionUpdated", (data) => {
            if (!mounted) return;
            const normalized = normalizePipedSession(data);
            setSessionsMap(prev => {
              const newMap = new Map(prev);

              if (newMap.has(normalized.sessionId)) {
                const existing = newMap.get(normalized.sessionId);
                newMap.set(normalized.sessionId, {
                  ...existing,
                  ...normalized,
                  cartridgesInserted: existing.cartridgesInserted + normalized.cartridgesInserted,
                  contactAttempted: existing.contactAttempted + normalized.contactAttempted,
                  pagesViewed: existing.pagesViewed + normalized.pagesViewed
                });
              } else {
                newMap.set(normalized.sessionId, normalized);
              }

              return newMap;
            })
          });

          connection.onreconnected(id => console.log("Reconnected with connectionId", id));
          connection.onclose(err => console.log("SignalR closed", err))
        } catch (err) {
          console.error("SignalR connection error:", err);
        }
      }
    }

    doTheThing();
    startConnection();



    return () => {
      mounted = false;
      connection.off("SessionUpdated");
    };
  }, [])

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      setContainerWidth(containerRef.current.clientWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <>
      <div ref={containerRef} className={styles.leveSessionsContainer}>
        <h2>Live Sessions</h2>
        <MultiRangeSlider
          min={0}
          max={MAX_MINUTES}
          step={STEP}
          ticks={HOUR_TICKS}
          onChange={({ min, max }) => setSelectedRange([MAX_MINUTES-min, MAX_MINUTES-max])}
        />
        {sessionsMap && <LiveAnalyticsGraph sessionsData={Array.from(sessionsMap.values())} timeRange={selectedRange}/>}
          <HeatMap
            startDate={new Date("2025-01-01")}
            end={new Date("2025-12-30")}
            rectSize={18}
            width={1200}
            style={{
              fontSize: 14,
            }}
          />
      </div>
    </>
  );
}



export default AnalyticsPage;
