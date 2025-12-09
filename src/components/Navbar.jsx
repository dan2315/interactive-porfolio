import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"
import { useEffect, useState } from "react";

export default function Navbar() { 
    const navButtons = [
        { name: "Experiences", id: "experiences" },
        { name: "Projects", id: "projects" },
        { name: "LeetCode", id: "leetcode" },
        { name: "Contact Me", id: "contact" },
    ]

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        navigate(`/${navButtons[0].id}`)
    }, [])
    const selectedPage = location.pathname.replace("/", "") || "experiences";

    return (
        <nav className={styles.navContainer}>
            <h2>Danil Prokhorenko</h2>
            <div className={styles.buttonsContainer}>
                {navButtons.map(btn => {
                    return (
                        <div                         
                            key={btn.name}
                            className={`${styles.navButton} ${selectedPage === btn.id ? styles.selected : ""}`}
                            onClick={() => navigate(`/${btn.id}`)}>
                            {btn.name}
                        </div>
                    )
                })}
            </div>
        </nav>
    );
}