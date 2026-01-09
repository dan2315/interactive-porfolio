import ExperiencePage from "../pages/ExperiencePage";
import LeetCodePage from "../pages/LeetCodePage";
import ProjectsPage from "../pages/ProjectsPage/ProjectsPage";
import { useConsoleStore } from "../stores/GameConsoleStore";
import IdleScreen from "./IdleScreen";
import ContactMePage from "../pages/ContactMePage";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useRouteStore } from "../stores/RouteStore";
import EditProjectsPage from "../pages/EditProjectsPage";
import AdminCurtain from "./AdminCurtain";

const routes = {
  0: {
    base: "main",
    name: "Portfolio",
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
    name: "Dev Insights",
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
    name: "Admin Panel",
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

function HtmlContent({ initSection }) {
  const prevCartridgeId = useRef(null);
  const isInit = prevCartridgeId.current === null;
  const route = useRouteStore((s) => s.route);
  const section = route?.split('/')[2];
  const navigate = useRouteStore(r => r.setRoute);
  const [page, setPage] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const { cartridgeId } = useConsoleStore();
  const cartridgeRoutes = routes[cartridgeId];
  const isAdminPage = cartridgeId === 2; 

  useEffect(() => {
    if (!cartridgeRoutes) {}
    else if (isInit && !!cartridgeRoutes.routes[initSection]) {
      navigate(`/${cartridgeRoutes.base}/${initSection}`);
    } 
    else if (prevCartridgeId.current !== cartridgeId) {
      const defaultSection = cartridgeRoutes && Object.keys(cartridgeRoutes.routes)[0];
      navigate(`/${cartridgeRoutes.base}/${defaultSection}`);
    }
    prevCartridgeId.current = cartridgeId;
  }, [cartridgeId, cartridgeRoutes, initSection, isInit, navigate]);

  useEffect(() => {
    if (!cartridgeRoutes) return;
    setPage(cartridgeRoutes.routes[section]?.element);
    setSelectedSection(section);
  }, [cartridgeRoutes, section, route])

  if (cartridgeId == null) return <IdleScreen />;
  
  return (
    <div className="app-container">
      <AdminCurtain enabled={isAdminPage}>
        <Navbar selectedPage={selectedSection} routes={cartridgeRoutes} />
        {page}
      </AdminCurtain>
    </div>
  );
}

export default HtmlContent;
