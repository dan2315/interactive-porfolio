import styles from "./LiveAnalyticsGraph.module.css"
import { useEffect, useRef } from "react";
import mockSessions from "../../../data/mockSessions.json";
import * as d3 from "d3";

function LiveAnalyticsGraph({ sessionsData, timeRange }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const tooltipRef = useRef(null);
  useEffect(() => {
    if (!tooltipRef.current) {
      tooltipRef.current = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#111")
        .style("color", "#fff")
        .style("padding", "8px 10px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("left", 0)
        .style("top", 0);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let frame;
    const resizeObserver = new ResizeObserver(entries => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { width } = entries[0].contentRect;
        draw(width);
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [sessionsData, timeRange]);

  function draw(width) { 
    const sessions = sessionsData.map((d) => ({
      ...d,
      start: new Date(d.startTime).getTime(),
      end: new Date(d.endTime).getTime(),
    }));

    const packed = assignLanes(sessions);
    const height = 300;

    const referenceTime = new Date();
    const [startMin, endMin] = timeRange;

    const domainStart = new Date(referenceTime.getTime() - startMin * 60_000);
    const domainEnd = new Date(referenceTime.getTime() - endMin * 60_000);

    const x = d3
      .scaleTime()
      .domain([domainStart, domainEnd])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(d3.range(0, d3.max(packed, (d) => d.lane) + 1))
      .range([0, height])
      .paddingInner(0.15);

    const xAxis = d3
      .axisBottom(x)
      .ticks(d3.timeMinute.every((endMin-startMin)/10))
      .tickFormat(d3.timeFormat("%H:%M"));

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("rect").remove();
    svg.selectAll("rect")
      .data(packed)
      .enter()
      .append("rect")
      .attr("x", (d) => x(new Date(d.start)))
      .attr("y", (d) => y(d.lane))
      .attr("width", (d) => x(new Date(d.end)) - x(new Date(d.start)))
      .attr("height", y.bandwidth())
      .attr("rx", 4)
      .attr("fill", "#69b3a2")
      .on("mouseenter", (event, d) => {
        tooltipRef.current.style("opacity", 1).html(`
        <div><strong>Session</strong></div>
        <div>⏱ ${formatDuration(d.totalTimeMs)}</div>
        <div>📄 Pages: ${d.pagesViewed}</div>
        <div>💾 Cartridges: ${d.cartridgesInserted}</div>
        <div>📞 Contacts: ${d.contactAttempted}</div>
      `);
      })
      .on("mousemove", (event) => {
        tooltipRef.current
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY + 12}px`);
      })
      .on("mouseleave", () => {
        tooltipRef.current.style("opacity", 0);
      });

    let xAxisGroup = svg.select(`.${styles.axis}`);

    if (xAxisGroup.empty()) {
      xAxisGroup = svg.append("g")
        .attr("class", styles.axis);
    }

    xAxisGroup
      .attr("transform", `translate(0, ${height-20})`)
      .call(xAxis);
  };

  return (
    <div ref={containerRef} className={styles.graphContainer}>
      <svg ref={svgRef}/>
    </div>
  );
}

function assignLanes(sessions) {
  sessions = [...sessions].sort((a, b) => a.start - b.start);
  const lanes = [];

  for (const interval of sessions) {
    let placed = false;

    for (let i = 0; i < lanes.length; i++) {
      if (interval.start >= lanes[i]) {
        lanes[i] = interval.end;
        interval.lane = i;
        placed = true;
        break;
      }
    }

    if (!placed) {
      interval.lane = lanes.length;
      lanes.push(interval.end);
      interval.lane = lanes.length - 1;
    }
  }

  return sessions;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${h}h ${m}m ${s}s`;
}

export default LiveAnalyticsGraph;
