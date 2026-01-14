import { useEffect, useState } from "react";
import { assistant } from "../stores/AssistantStore";

export function useAssistant() {
  const [state, setState] = useState({
    visible: false,
    text: "",
  });

  useEffect(() => {
    return assistant.subscribe((s) => {
      setState({
        visible: s.visible,
        text: s.text,
      });
    });
  }, []);

  return state;
}