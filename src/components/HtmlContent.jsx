import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useConsole } from "../contexts/GameConsoleContext";
import { CartridgeType } from "./3d/Cartridge";
import Navbar from "./Navbar";
import ExperiencePage from "../pages/ExperiencePage";
import LeetCodePage from "../pages/LeetCodePage";
import ProjectsPage from "../pages/ProjectsPage";

function HtmlContent() {
    const { cartridgeId } = useConsole();
    console.log("CONTEXT CHANGED", cartridgeId)

    let content;
    switch (cartridgeId) {
        case CartridgeType.main:
            <Router>
                <Navbar/>
                <Routes>
                <Route path="/experiences" element={<ExperiencePage />} />
                <Route path="/leetcode" element={<LeetCodePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                </Routes>
            </Router>
        break;
        case CartridgeType.additional:

        break;
        case CartridgeType.admin:

        break;
    
        default:

        break;
    }

    return content;
}

export default HtmlContent;