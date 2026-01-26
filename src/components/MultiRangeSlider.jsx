import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./MultiRangeSlider.module.css";

const MultiRangeSlider = ({ min, max, step, ticks, onChange }) => {

  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal]);

  return (
    <div className={styles.container}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(e) => {
          const value = Math.min(+e.target.value, maxVal - step);
          setMinVal(value);
          minValRef.current = value;
        }}
        className={`${styles.thumb} ${styles["thumb--left"]}`}
        style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(e) => {
          const value = Math.max(+e.target.value, minVal + step);
          setMaxVal(value);
          maxValRef.current = value;
        }}
        className={`${styles.thumb} ${styles["thumb--right"]}`}
      />

      <div className={styles.slider}>
        <div className={styles["slider__track"]} />
        <div ref={range} className={styles["slider__range"]} />
      </div>

      <div className={styles.ticks}>
      {ticks.map((t, idx) => (
        <div
          key={t.value}
          className={styles.tick}
          style={{
            "--i": idx,
            "--n": ticks.length - 1,
          }}
        >
          <div className={styles.tickMark} />
          <div className={styles.tickLabel}>{t.label}</div>
        </div>
      ))}
    </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
