import { createContext, useContext, useState } from "react";

export const GameConsoleContext = createContext(null);

export function GameConsoleProvider({ children }) {
  const [cartridgeId, setCartridgeId] = useState(null);

  return (
    <GameConsoleContext.Provider value={{ cartridgeId, setCartridgeId }}>
      {children}
    </GameConsoleContext.Provider>
  );
}

export const useConsole = () => {
  const ctx = useContext(GameConsoleContext);
  if (!ctx) throw new Error("useConsole must be used inside ConsoleProvider");
  return ctx;
};
