import ExperiencePage from "../pages/ExperiencePage";
import LeetCodePage from "../pages/LeetCodePage";
import ProjectsPage from "../pages/ProjectsPage/ProjectsPage";
import { useConsoleStore } from "../stores/GameConsoleStore";
import IdleScreen from "./IdleScreen";
import ContactMePage from "../pages/ContactMePage";
import { useEffect, useRef } from "react";
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

function HtmlContent() {
  const route = useRouteStore((s) => s.route);
  const section = route?.split('/')[2];
  const navigate = useRouteStore(r => r.setRoute);
  const { cartridgeId } = useConsoleStore();
  const prevCartridgeId = useRef(-1);
  const cartridgeRoutes = routes[cartridgeId];
  const isAdminPage = cartridgeId === 2; 
  const defaultSection = cartridgeRoutes && Object.keys(cartridgeRoutes.routes)[0];

  useEffect(() => {
    if (cartridgeId == null || !cartridgeRoutes) return;

    if (prevCartridgeId.current !== cartridgeId) {
      prevCartridgeId.current = cartridgeId;
      navigate(`${cartridgeRoutes.base}/${defaultSection}`);
      return;
    }

  }, [cartridgeId, cartridgeRoutes, section, navigate, defaultSection]);

  if (cartridgeId == null) return <IdleScreen />;

  const selectedSection = section ?? defaultSection; 

  const Page =
    selectedSection &&
    cartridgeRoutes?.routes[selectedSection]?.element;
  
  return (
    <div className="app-container">
      <AdminCurtain enabled={isAdminPage}>
        <Navbar selectedPage={selectedSection} routes={cartridgeRoutes} />
        {Page}
      </AdminCurtain>
    </div>
  );
}

export default HtmlContent;
