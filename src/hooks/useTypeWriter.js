import { useEffect, useState } from "react";

function useTypewriter(text, speed = 30) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const completed = i > text.length;
      setOutput(text.slice(0, i) + (completed ? "" : "..."));
      i++;
      if (completed) clearInterval(id);
    }, speed);

    return () => clearInterval(id);
  }, [speed, text]);

  return output;
}

export default useTypewriter;
