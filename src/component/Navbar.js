import React, { useContext, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import Notescontext from "../context/notes/NoteContext";
import { ThemeContext } from "../context/ThemeContext";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const { setnotes, notes, Getnotes } = useContext(Notescontext);
  const { setCurrentTheme, themes } = useContext(ThemeContext);
  const host = process.env.REACT_APP_API_HOST || 'http://localhost:5000';



  useEffect(() => {
    if (token) {
      Getnotes();
    }
  }, [notes.length]);

  const handleThemeSelect = async (themeName) => {
    try {
      const res = await fetch(`${host}/api/auth/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authtoken": token,
        },
        body: JSON.stringify({ theme: themeName }),
      });
      setCurrentTheme(themeName);
      localStorage.setItem("theme", themeName);

      if (!res.ok) throw new Error("Failed to save theme");

      document.body.style.background = themes[themeName];
      localStorage.setItem("theme", themeName);
    } catch (err) {
      console.error("Error saving theme:", err);
    }
  };

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX - touchStartX > 80) {
        const sidebar = document.getElementById("sidebarOffcanvas");
        if (sidebar) {
          const bsOffcanvas = new window.bootstrap.Offcanvas(sidebar);
          bsOffcanvas.show();
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Scroll .main-content to top on route change
  useEffect(() => {
    closeSidebar();

    // try the scroll container first
    const el = document.querySelector(".main-content");

    if (el) {
      // prevent smooth scroll weirdness
      const prev = el.style.scrollBehavior;
      el.style.scrollBehavior = "auto";
      el.scrollTop = 0;
      el.scrollLeft = 0;
      el.style.scrollBehavior = prev;
    } else {
      // fallback to window if no container
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname]);


  const handleLogout = () => {
    localStorage.removeItem("token");

    setnotes([]);
    alert("You have been logged out!");
    navigate("/login");
  };

  const handleNoteClick = (id) => {
    const currentSummarizing = localStorage.getItem("summarizingId");
    if (currentSummarizing) {
      alert("Wait for summarization to finish!");
      return;
    }
    navigate(`/edit/${id}`);
  };

  const closeSidebar = () => {
    const sidebar = document.getElementById("sidebarMenu");
    if (sidebar && sidebar.classList.contains("show")) {
      const bsCollapse =
        window.bootstrap.Collapse.getInstance(sidebar) ||
        new window.bootstrap.Collapse(sidebar);
      bsCollapse.hide();
    }
  };

  return (
    <div className="app-layout py-3">
      {/* Top Navbar */}
      <nav
        className="navbar fixed-top navbar-expand-lg shadow-sm py-1"
        style={{
          paddingRight: "2rem",
          paddingLeft: "2rem",
        }}
      >
        <div className="container-fluid">
          {/* Mobile sidebar toggle */}
          <button
            className="btn d-lg-none me-2"
            style={{ color: "white", backgroundColor: "#031111ff" }}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
          >
            ☰
          </button>

          <NavLink
            className="navbar-brand fw-bold text-uppercase brand-text"
            to="/"
          >
            NOTEZY
          </NavLink>

          <div className="navbar-links d-flex ms-auto">
            <ul className="navbar-nav d-flex flex-row align-items-center">
              <li className="nav-item mx-2">
                <NavLink
                  className="nav-link nav-animated text-uppercase"
                  to="/pinned"
                >
                  Pinned
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink
                  className="nav-link nav-animated text-uppercase"
                  to="/all"
                >
                  All notes
                </NavLink>
              </li>

              {/* Theme Dropdown */}
              <li className="nav-item dropdown mx-2">
                <button
                  className="nav-link nav-animated text-uppercase btn btn-link"
                  id="themeDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Theme ⬇
                </button>

                <ul
                  className="dropdown-menu theme-menu"
                  aria-labelledby="themeDropdown"
                >
                  <li>
                    <button
                      className="theme-circle"
                      style={{ background: themes.darkOcean }}
                      onClick={() => handleThemeSelect("darkOcean")}
                    ></button>
                  </li>
                  <li>
                    <button
                      className="theme-circle"
                      style={{ background: themes.peachy }}
                      onClick={() => handleThemeSelect("peachy")}
                    ></button>
                  </li>
                  <li>
                    <button
                      className="theme-circle"
                      style={{ background: themes.cyanBlue }}
                      onClick={() => handleThemeSelect("cyanBlue")}
                    ></button>
                  </li>
                  <li>
                    <button
                      className="theme-circle"
                      style={{ background: themes.greenLeaf }}
                      onClick={() => handleThemeSelect("greenLeaf")}
                    ></button>
                  </li>
                </ul>
              </li>

              <li className="nav-item mx-2">
                {token ? (
                  <button
                    className="btn nav-link text-uppercase text-danger"
                    style={{ border: "none", background: "none" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink
                    className="nav-link nav-animated text-uppercase"
                    to="/login"
                  >
                    Login / Signup
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="sidebar collapse d-lg-block" id="sidebarMenu">
        <div className="sidebar-content p-3">
          {/* Logo */}
          <div className="mb-4 d-flex align-items-center" style={{ alignContent: "center" }}>
            <i className="bi bi-journal-text" style={{ fontSize: "2rem" }}></i>

            <span className="fw-bold fs-5">Notezy</span>
          </div>

          {/* Sidebar Options */}
          <div className="mb-3">
            <Link
              to="/"
              className="btn btn-outline-light w-100 mb-2"
            >
              New Note ➕
            </Link>
            <Link
              to="/favourites"
              className="btn btn-outline-light w-100 mb-2"
            >
              Favourites ❤️
            </Link>
            <Link
              to="/all"
              className="btn btn-outline-light w-100 mb-2"
            >
              All Notes 📝
            </Link>
            <Link
              to="/deleted"
              className="btn btn-outline-light w-100 mb-2"
            >
              Recently Deleted
            </Link>

          </div>

          <hr />

          {/* Notes List */}
          <h6 className="text-uppercase text-muted mb-3">Recent</h6>
          {notes.length === 0 && <p>No notes yet</p>}
          <ul className="list-unstyled">
            {notes
              .filter((note) => note.deleted === false)
              .slice()
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .map((note) => {
                const isActive = location.pathname === `/edit/${note._id}`;
                return (
                  <li
                    key={note._id}
                    className={`p-2 mb-2 rounded note-item ${isActive ? "active-note" : ""
                      }`}
                    onClick={() => handleNoteClick(note._id)}
                  >
                    <div className="fw-bold">
                      {note.title.length > 20
                        ? note.title.slice(0, 20) + "..."
                        : note.title}
                    </div>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {note.description.length > 30
                        ? note.description.slice(0, 30) + "..."
                        : note.description}
                    </small>
                  </li>
                );
              })}
          </ul>

          <hr />

          {/* More Links */}
          <h6 className="text-uppercase text-muted mb-3">More</h6>
          <NavLink className="nav-link text-white mb-2" to="/about">
            About
          </NavLink>
          <NavLink className="nav-link text-white mb-2" to="/contact">
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
