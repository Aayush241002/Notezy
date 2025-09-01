import React, { useContext } from "react";
import Notescontext from "../context/notes/NoteContext";
import { useNavigate } from "react-router-dom";
import "./Noteitems.css";
import { useLocation } from "react-router-dom";

const Noteitem = ({ note }) => {
  const { Deletenote, Editnote, Removenote , Restorenote} = useContext(Notescontext);
  const location = useLocation();

  const navigate = useNavigate();

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString();
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest(".note-icons")) return;
    navigate(`/edit/${note._id}`);
  };

  // toggle favourite
  const toggleFavourite = async (e) => {
    e.stopPropagation();
    await Editnote(
      note._id,
      note.title,
      note.description,
      note.tag,
      note.pinned,

      !note.favourite       // flip favourite
    );
  };

  // toggle pinned
  const togglePinned = async (e) => {
    e.stopPropagation();
    await Editnote(
      note._id,
      note.title,
      note.description,
      note.tag,
      !note.pinned,         // flip pinned
      note.favourite,

    );
  };

  return (
    <div className="col-md-4 my-3">
      <div
        className="note-card"
        onClick={handleCardClick}
        style={{
          cursor: "pointer",
          borderRadius: "12px",
          padding: "1.2rem",
          color: "#969aa3ff",
          transition: "all 0.2s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "220px",
          position: "relative",
        }}
      >
        {/* Top-right icons (pin + fav) */}
        <div
          className="note-icons"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: "10px",
            fontSize: "1.3rem",
            color: "#969aa3ff",
            paddingBottom: "2rem"
          }}
        >
          <i
            className={note.pinned ? "bi bi-pin-angle-fill" : "bi bi-pin-angle"}
            title={note.pinned ? "Unpin" : "Pin"}
            style={{ cursor: "pointer", color: "#f6f7f9ff" }}
            onClick={togglePinned}
          ></i>

          <i
            className={note.favourite ? "bi bi-heart-fill" : "bi bi-heart"}
            title={note.favourite ? "Unfavourite" : "Favourite"}
            style={{ cursor: "pointer", color: note.favourite ? "red" : "white" }}
            onClick={toggleFavourite}
          ></i>
        </div>

        {/* Title + Description */}
        <div>
          <h5
            style={{
              fontWeight: "600",
              fontSize: "1.3rem",
              marginBottom: "0.5rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={note.title}
          >
            {note.title || "Untitled"}
          </h5>

          <p
            style={{
              fontSize: "0.95rem",
              color: "#9ca3af",
              lineHeight: "1.4rem",
              height: "4.2rem", // 3 lines max
              overflow: "hidden",
            }}
          >
            {note.description || "No description"}
          </p>
        </div>

        {/* Tag + Date */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span
            style={{
              fontSize: "0.8rem",
              backgroundColor: "#374151",
              padding: "0.25rem 0.6rem",
              borderRadius: "0.4rem",
              color: "#f3f4f6",
            }}
          >
            {note.tag || "General"}
          </span>

          <small style={{ color: "#f6f7f9ff" }}>{formatDate(note.timestamp)}</small>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end mt-3 gap-2">
          <button
            type="button"
            className="btn btn-sm" style={{ color: "#aaafb7ff" }}
            onClick={(e) => {

              e.stopPropagation();
              if (location.pathname === "/deleted") {
                Deletenote(note._id);

              } else {

                Removenote(note._id);
              }
            }}
          >
            <i className="bi bi-trash3"></i>

          </button>

          {location.pathname === "/deleted" && (
            <button
              type="button"
              className="btn btn-sm"
              style={{ color: "#aaafb7ff" }}
              onClick={(e) => {
                e.stopPropagation();
                Restorenote(note._id);
              }}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          )}




          <button
            type="button"
            className="btn btn-sm" style={{ color: "white" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit/${note._id}`);
            }}
          >
            <i className="bi bi-pencil-square"></i>
          </button>
        </div>
      </div>
    </div >
  );
};

export default Noteitem;
