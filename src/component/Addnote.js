import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import Notescontext from "../context/notes/NoteContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import "./Addnote.css";
import Spinner from "./Spinner";

function Addnote() {
  const { addnote, Editnote, notes } = useContext(Notescontext);
  const [note, setnote] = useState({
    title: "",
    description: "",
    tag: "General",
    pinned: false,
    favourite: false,
  });
  const host = process.env.REACT_APP_API_HOST || 'http://localhost:5000';

  const [errors, setErrors] = useState({});
  const [isSummarized, setIsSummarized] = useState(false);
  const [istitled, setistitled] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const location = useLocation();
  const [spinner, setspinner] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const justSavedRef = useRef(false);

  const textareaRef = useRef(null);
  const titleRef = useRef(null);

  // store latest note + leaving id in refs
  const noteRef = useRef(note);
  const leavingIdRef = useRef(id);

  useEffect(() => {
    noteRef.current = note;
  }, [note]);

  useEffect(() => {
    leavingIdRef.current = id;
  }, [id]);

  //  load note or draft
  useEffect(() => {
    if (id && notes.length > 0) {
      const existingNote = notes.find((n) => n._id === id);
      if (existingNote) {
        setnote(existingNote);
      }
    } else {
      const savedDraft = localStorage.getItem("unsavedNote");
      if (savedDraft) {
        setnote(JSON.parse(savedDraft));
      } else {
        setnote({
          title: "",
          description: "",
          tag: "General",
          pinned: false,
          favourite: false,
        });
      }
    }

    setIsSummarized(false);
    setistitled(false);
    setOriginalText("");
    setspinner(false);
  }, [id, notes]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [note.description]);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [note.title]);

  //  silent save implementation
  const silentSave = useCallback(async (currentNote, targetId) => {

    if (!localStorage.getItem("token")) {
      if (!targetId) {
        localStorage.setItem("unsavedNote", JSON.stringify(currentNote));
      }
      return;
    }

    const payload = {
      ...currentNote,
      title: currentNote.title?.trim() || "Untitled",
    };

    try {
      if (targetId) {
        await Editnote(
          targetId,
          payload.title,
          payload.description,
          payload.tag,
          payload.pinned,
          payload.favourite
        );
      } else {
        await addnote(
          payload.title,
          payload.description,
          payload.tag,
          payload.pinned,
          payload.favourite
        );
      }
      localStorage.removeItem("unsavedNote");
    } catch (err) {
      console.error("silentSave failed:", err);
    }
  }, []);

  //  cleanup on navigation
  useEffect(() => {
    return () => {

      if (justSavedRef.current) {
        justSavedRef.current = false;
        return;
      }
      const latestNote = noteRef.current;
      const leavingId = leavingIdRef.current;

      const token = localStorage.getItem("token");
      if (!token) return;

      if (location.pathname.includes("/login") || location.pathname.includes("/signup")) {
        return;
      }

      if (latestNote.title.trim() || latestNote.description.trim()) {
        silentSave(latestNote, leavingId);
      }
    };
  }, [location.pathname, silentSave]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...note, [name]: value };
    setnote(updated);
    if (!id) {
      localStorage.setItem("unsavedNote", JSON.stringify(updated));
    }
  };

  const togglePinned = () => {
    const updated = { ...note, pinned: !note.pinned };
    setnote(updated);
    if (!id) {
      localStorage.setItem("unsavedNote", JSON.stringify(updated));
    }
  };

  const toggleFavourite = () => {
    const updated = { ...note, favourite: !note.favourite };
    setnote(updated);
    if (!id) {
      localStorage.setItem("unsavedNote", JSON.stringify(updated));
    }
  };

  //  your summarize & title generation untouched 
  const toggleSummarize = async () => {
    if (!isSummarized) {
      setOriginalText(note.description);
      if (note.description !== "") {
        setspinner(true);
      }
      try {
        const res = await fetch(`${host}/api/notes/summarize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ text: note.description }),
        });

        const data = await res.json();

        if (data.summary) {
          setnote((prev) => ({ ...prev, description: data.summary }));
          setIsSummarized(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setspinner(false);
      }
    } else {
      setnote((prev) => ({ ...prev, description: originalText }));
      setIsSummarized(false);
    }
  };

  const togglegeneratetitle = async () => {
    if (!istitled) {
      setOriginalTitle(note.title);
      if (note.description !== "") {
        setspinner(true);
      }
      try {
        const res = await fetch(
          `${host}/api/notes/generatetitle`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ text: note.description }),
          }
        );

        const data = await res.json();

        if (data.title) {
          setnote((prev) => ({ ...prev, title: data.title }));
          setistitled(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setspinner(false);
      }
    } else {
      setnote((prev) => ({ ...prev, title: originalTitle }));
      setistitled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    justSavedRef.current = true;

    if (!localStorage.getItem("token")) {
      if (!id) {
        localStorage.setItem("unsavedNote", JSON.stringify(note));
        localStorage.setItem("redirectAfterLogin", "/add");
      }

      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!note.title.trim()) note.title = "Untitled";

    let res;
    if (id) {
      res = await Editnote(
        id,
        note.title,
        note.description,
        note.tag,
        note.pinned,
        note.favourite
      );
      if (!res.errors) {
        alert("Note Updated");
        localStorage.removeItem("unsavedNote");
        setnote({
          title: "",
          description: "",
          tag: "General",
          pinned: false,
          favourite: false,
        });
        setIsSummarized(false);
        setOriginalText("");
        navigate("/");
      }
    } else {
      res = await addnote(
        note.title,
        note.description,
        note.tag,
        note.pinned,
        note.favourite
      );
      if (!res.errors) {
        alert("Note Added ");
        localStorage.removeItem("unsavedNote");
        setnote({
          title: "",
          description: "",
          tag: "General",
          pinned: false,
          favourite: false,
        });
        setIsSummarized(false);
        setOriginalText("");
        navigate("/");
      }
    }

    if (res.errors) {
      const newErrors = {};
      res.errors.forEach((err) => (newErrors[err.path] = err.msg));
      setErrors(newErrors);
    } else {
      setErrors({});
    }
  };

  return (
    <div
      className="justify-content-center addnote"
      style={{
        color: "white",
        minHeight: "100vh",
        maxWidth: "100%",
        padding: "1rem",
        paddingTop: "1",
        position: "relative",
        zIndex: 900,
      }}
    >
      <form onSubmit={handleSubmit} style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ paddingBottom: "1.5rem", paddingTop: "2rem", display: "flex", gap: "1rem" }}>
          <i
            className={note.pinned ? "bi bi-pin-angle-fill" : "bi bi-pin-angle"}
            title={note.pinned ? "Unpin" : "Pin"}
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={togglePinned}
          ></i>
          <i
            className={note.favourite ? "bi bi-heart-fill" : "bi bi-heart"}
            title={note.favourite ? "Unfavourite" : "Favourite"}
            style={{ fontSize: "1.5rem", cursor: "pointer", color: note.favourite ? "red" : "white" }}
            onClick={toggleFavourite}
          ></i>
        </div>

        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={toggleSummarize}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: isSummarized ? "#293636ff" : "#0b1a1aff",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            {isSummarized ? "Summarized" : "Summarize"}
          </button>

          <button
            type="button"
            onClick={togglegeneratetitle}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: istitled ? "#293636ff" : "#0b1a1aff",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Get Title
          </button>

        </div>
        {spinner && <Spinner />}


        {/* Title */}
        <textarea
          ref={titleRef}
          name="title"
          value={note.title}
          onChange={(e) => {
            handleChange(e);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          placeholder="Title"
          rows={1}
          style={{
            width: "100%",
            fontSize: "1.5rem",
            fontWeight: "bold",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            color: "white",
            marginBottom: "1rem",
            caretColor: "white",
            fontFamily: "-moz-initial",
            resize: "none",
            overflow: "hidden",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        />


        <p className="text-danger">{errors.title}</p>

        <textarea
          ref={textareaRef}
          name="description"
          value={note.description}
          onChange={(e) => {
            handleChange(e);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          placeholder="Take a note..."
          rows={1}
          style={{
            width: "100%",
            fontSize: "1rem",
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            color: "white",
            resize: "none",
            overflow: "hidden",
            fontFamily: "sans-serif",
            caretColor: "auto",
            zIndex: 950,
            lineHeight: "1.5rem",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            overflowY: "auto",
          }}
        />

        <p className="text-danger">{errors.description}</p>

        {/* Tag */}
        <select
          name="tag"
          value={note.tag}
          onChange={handleChange}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            borderRadius: "0.3rem",
            border: "none",
            outline: "none",
            backgroundColor: "#1b2a2aff",
            color: "white",
            zIndex: 950,
          }}
        >
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Ideas">Ideas</option>
          <option value="Personal">Personal</option>
          <option value="Quotes">Quotes</option>
          <option value="Study">Study</option>
        </select>

        {/* Floating Add/Save button */}
        <button
          type="submit"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "calc(3rem + 200px)",
            backgroundColor: "#3420e8ff",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "2rem",
            cursor: "pointer",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
            zIndex: 1000,
          }}
        >
          {id ? "💾" : "+"}
        </button>
      </form>
    </div>
  );
}

export default Addnote;
