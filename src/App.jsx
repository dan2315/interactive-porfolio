import "./App.css";
import { Route, BrowserRouter, Routes  } from "react-router-dom";
import Scene from "./components/Scene";
import RouteManager from "./components/RouteManager";

function App() {
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