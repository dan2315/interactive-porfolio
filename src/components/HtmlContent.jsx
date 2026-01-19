import ExperiencePage from "../pages/ExperiencePage";
import LeetCodePage from "../pages/LeetCodePage/LeetCodePage";
import ProjectsPage from "../pages/ProjectsPage/ProjectsPage";
import { useConsoleStore } from "../stores/GameConsoleStore";
import IdleScreen from "./IdleScreen";
import ContactMePage from "../pages/ContactMePage";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useRouteStore } from "../stores/RouteStore";
import EditProjectsPage from "../pages/EditProjectsPage";
import AdminCurtain from "./AdminCurtain";
import GitHubPage from "../pages/GitHubPage";
import { useAppStore } from "../stores/AppStore";

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
        element: <GitHubPage />,
      },
    },
  },
  2: {
    base: "admin",
    name: "Admin Panel",
    routes: {
      projects: {
        name: "Edit Projects",
        element: <EditProjectsPage/>
      }
    },
  },
};

function HtmlContent({ initSection, restOfTheRoute }) {
  const { isFirstVisit } = useAppStore();
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
    if (!cartridgeRoutes) {
      if (isInit && isFirstVisit) {
        navigate(`/main/experiences`);
        console.log("first", initSection);
      }
    }
    else if (isInit && !!cartridgeRoutes.routes[initSection]) {
      navigate(`/${cartridgeRoutes.base}/${initSection}/${restOfTheRoute}`);
      console.log("init", initSection);
    }
    else if (prevCartridgeId.current !== cartridgeId) {
      const defaultSection = cartridgeRoutes && Object.keys(cartridgeRoutes.routes)[0];
      navigate(`/${cartridgeRoutes.base}/${defaultSection}`);
      console.log("default", defaultSection);
    }
    prevCartridgeId.current = cartridgeId;
  }, [cartridgeId, cartridgeRoutes, initSection, isFirstVisit, isInit, navigate, restOfTheRoute]);

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
