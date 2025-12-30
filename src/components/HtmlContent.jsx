import ExperiencePage from "../pages/ExperiencePage";
import LeetCodePage from "../pages/LeetCodePage";
import ProjectsPage from "../pages/ProjectsPage/ProjectsPage";
import { useConsoleStore } from "../stores/GameConsoleStore";
import IdleScreen from "./IdleScreen";
import ContactMePage from "../pages/ContactMePage";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useRouteStore } from "../stores/RouteStore";
import EditProjectsPage from "../pages/EditProjectsPage";
import AdminCurtain from "./AdminCurtain";

const routes = {
  0: {
    base: "main",
    routes: {
      experiences: {
        name: "Experiences",
        element: <ExperiencePage />,
      },
      projects: {
        name: "Projects",
        element: <ProjectsPage />,
      },
      contact: {
        name: "Contact Me",
        element: <ContactMePage />,
      },
    },
  },
  1: {
    base: "additional",
    routes: {
      leetcode: {
        name: "LeetCode",
        element: <LeetCodePage />,
      },
      github: {
        name: "GitHub",
        element: <LeetCodePage />,
      },
    },
  },
  2: {
    base: "admin",
    routes: {
      experiences: {
        name: "Edit Experiences",
        element: <></>
      },
      projects: {
        name: "Edit Projects",
        element: <EditProjectsPage/>
      }
    },
  },
};

function HtmlContent( {initSection} ) {
  const section = useRouteStore((s) => s.route)?.split('/')[2];
  const { cartridgeId } = useConsoleStore();
  const [page, setPage] = useState(null);
  const cartridgeRoutes = routes[cartridgeId];
  const isAdminPage = cartridgeId === 2; 

  console.log("Path:", cartridgeId, section);

  useEffect(() => {
    if (!cartridgeRoutes || !section) return;
    console.log(
      "Trying to get page:",
      cartridgeRoutes.routes[section]?.element
    );
    setPage(cartridgeRoutes.routes[section]?.element);
  }, [cartridgeRoutes, section]);

  if (cartridgeId == null) return <IdleScreen />;

  return (
    <div className="app-container">
      <AdminCurtain enabled={isAdminPage}>
        <Navbar selectedPage={section} initPage={initSection} routes={cartridgeRoutes} />
        {page}
      </AdminCurtain>
    </div>
  );
}

export default HtmlContent;
