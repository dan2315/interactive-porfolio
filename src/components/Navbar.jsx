import { useRouteStore } from "../stores/RouteStore";
import styles from "./Navbar.module.css"
import { useEffect } from "react";

export default function Navbar({routes, selectedPage, initPage}) { 
    const navigate = useRouteStore(r => r.setRoute);
    console.log(routes)

    function navigateTo(section) {
        navigate(`/${routes.base}/${section}`)
    }

    useEffect(() => {
        if (!routes.routes) return;
        navigateTo(initPage ?? Object.keys(routes.routes)[0]);
    }, []);

    if (!routes.routes) return;

    return (
        <nav className={styles.navContainer}>
            <h2>Danil Prokhorenko</h2>
            <div className={styles.buttonsContainer}>
                {Object.entries(routes.routes).map(([routeKey, route]) => {
                    return (
                        <div                         
                            key={routeKey}
                            className={`${styles.navButton} ${selectedPage === routeKey ? styles.selected : ""}`}
                            onClick={() => navigateTo(routeKey)}
                            >
                            {route.name}
                        </div>
                    )
                })}
            </div>
        </nav>
    );
}