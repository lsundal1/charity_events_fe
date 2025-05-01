import { useState, useEffect } from "react";

export default function BackToTopButton () {
    const [isVisible, setIsVisible] = useState(false);


    const toggleVisibility = () => {
        if (window.scrollY > 300) {
        setIsVisible(true);
        } else {
        setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
        top: 0,
        behavior: "smooth", 
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        isVisible && (
        <button
            onClick={scrollToTop}
            style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            zIndex: 1000,
            }}
        >
            ↑ Top
        </button>
        )
    );
};

