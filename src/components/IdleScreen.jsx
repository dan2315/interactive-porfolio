import styles from "./IdleScreen.module.css"
import React, { useEffect, useRef } from "react";

const IdleScreen = () => {
  const velocity = useRef({ x: 3, y: 3 });
  const position = useRef({ x: 100, y: 100 });
  const dodRef = useRef();
  const dodTextRef = useRef();
  const underTextRef = useRef();
  const svgRef = useRef();

  useEffect(() => {
    const handle = setInterval(() => {

    }, 16);

    return () => clearInterval(handle);
  }, [velocity]);

  useEffect(() => {
    let animationFrame;

    const animate = () => {
      const el = dodRef.current;
      if (!el) return;

      position.current.x += velocity.current.x;
      position.current.y += velocity.current.y;

      const maxX = 1600 - el.offsetWidth;
      const maxY = 900 - el.offsetHeight;

      let bounced = false;

      if (position.current.x <= 0 || position.current.x >= maxX) {
        velocity.current.x *= -1;
        position.current.x = Math.max(0, Math.min(position.current.x, maxX));
        bounced = true;
      }
      if (position.current.y <= 0 || position.current.y >= maxY) {
        velocity.current.y *= -1;
        position.current.y = Math.max(0, Math.min(position.current.y, maxY));
        bounced = true;
      }

      if (bounced) {
        const randomColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
        if (dodTextRef.current) dodTextRef.current.style.color = randomColor;
        if (underTextRef.current) underTextRef.current.style.color = randomColor;
        if (svgRef.current) svgRef.current.style.fill = randomColor;
      }

      el.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className={styles.container}>
      <div ref={dodRef} className={styles.floatingblock}>
        <div ref={dodTextRef} className={styles.dod}>
          DOD
        </div>
        <svg
          width="100%"
          height="10"
          style={{ position: "absolute", top: "60px", left: 0 }}
        >
          <ellipse ref={svgRef} id="outer-svg" cx="50%" cy="5" rx="50%" ry="5" fill="rgb(255, 255, 255)" />
        </svg>
        <svg
          width="100%"
          height="10"
          style={{ position: "absolute", top: "62px", left: 0 }}
        >
          <ellipse cx="50%" cy="3" rx="15%" ry="3" fill="rgb(0, 0, 0)" />
        </svg>
        <div ref={underTextRef} className={styles.undertext}>
          PORTFOLIO
        </div>
      </div>
    </div>
  );
};

export default IdleScreen;