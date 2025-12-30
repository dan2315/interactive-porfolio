import {  useNavigate } from "react-router-dom";
import { useRouteStore } from "../stores/RouteStore";
import { useEffect } from "react";


function RouteManager() {
    const route = useRouteStore(s => s.route);
    const navigate = useNavigate();

    useEffect(() => {
        navigate(route);
    }, [navigate, route])
}

export default RouteManager;
