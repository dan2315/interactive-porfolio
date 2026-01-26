import "./App.css";
import { Route, BrowserRouter, Routes  } from "react-router-dom";
import Scene from "./components/Scene";
import RouteManager from "./components/RouteManager";
import { useTouchOnlyDevice } from "./hooks/useIsTouchOnlyDevice";
import DeviceNotSupportedPage from "./pages/DeviceNotSupportedPage";
import { useEffect } from "react";
import { analytics } from "./services/analytics";

function App() {
    const notAllowed = useTouchOnlyDevice();

    useEffect(() => {
        const handleBeforeUnload = () => {
            analytics.sendPageLeave(window.location.pathname);
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [])
     
    if (notAllowed) return <DeviceNotSupportedPage/>;

    return(
    <BrowserRouter>
        <RouteManager/>
        <Routes>
            <Route path="/:cartridge/:section/*" element={<Scene />} />
            <Route path="/:cartridge" element={<Scene />} />
            <Route path="*" element={<Scene />} />
        </Routes>
    </BrowserRouter>
    )
}

export default App;