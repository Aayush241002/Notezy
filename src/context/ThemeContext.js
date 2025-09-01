// context/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("cyanBlue");

  const themes = {
    default: "linear-gradient(135deg, #33464fff, #010e12ff)", // map backend default
    darkOcean: "linear-gradient(135deg, #3e3e55, #0d0b10)",
    peachy: "linear-gradient(135deg, #372d2dff, #0e0a08ff)",
    cyanBlue: "linear-gradient(135deg, #33464fff, #010e12ff)",
    greenLeaf: "linear-gradient(135deg, #3f493cff, #060803ff)",
  };
  const extractSecondColor = (gradient) => {

    const match = gradient.match(/#([0-9a-f]{6,8})/gi); // get all hex colors
    return match ? match[match.length - 1] : "#000000"; // return last one (fallback black)
  };
  // Fetch saved theme from backend on mount
  useEffect(() => {
    const fetchTheme = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // skip if not logged in

      try {
        const res = await fetch("http://localhost:5000/api/auth/theme", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authtoken: token,
          },
        });
        const data = await res.json();
        if (data.theme) setCurrentTheme(data.theme);
      } catch (err) {
        console.error("Error fetching theme:", err);
      }
    };

    fetchTheme();
  }, []);

  // Update CSS variable whenever theme changes
  useEffect(() => {
    const gradient = themes[currentTheme];
    const sidebarColor = extractSecondColor(gradient);
    document.documentElement.style.setProperty("--main-bg", gradient);
    document.documentElement.style.setProperty("--sidebar-bg", sidebarColor);

  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
