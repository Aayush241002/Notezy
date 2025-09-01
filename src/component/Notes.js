import React, { useContext, useEffect } from "react";
import NotesItems from "./NotesItems";
import Notescontext from "../context/notes/NoteContext";
import { useLocation } from "react-router-dom";
import "./Notes.css"
function Notes() {
  const { notes, Getnotes } = useContext(Notescontext);
  const location = useLocation();

  useEffect(() => {
    Getnotes();
    // eslint-disable-next-line
  }, []);
  let filteredNotes = [...notes];

  if (location.pathname === "/pinned") {
    filteredNotes = filteredNotes.filter((n) => n.pinned === true && n.deleted === false);
  }
  else if (location.pathname === "/favourites") {
    filteredNotes = filteredNotes.filter((n) => n.favourite === true && n.deleted === false);
  }
  else if (location.pathname === "/deleted") {
    filteredNotes = filteredNotes.filter((n) => n.deleted === true);
  }
  else {
    filteredNotes = filteredNotes.filter((n) => n.deleted === false);
  }

  // sort notes (recent first by _id)
  const sortedNotes = filteredNotes.sort((a, b) =>
    b._id.localeCompare(a._id)
  );

  const hasNotes = sortedNotes.length > 0;

  return (
    <div className="justify-content-center notes-wrapper">
{hasNotes && (
  <div className="align-items-center">
    <h2 className="mb-0">
      {location.pathname === "/pinned"
        ? "Pinned"
        : location.pathname === "/favourites"
          ? "Favourites"
          : location.pathname === "/deleted"
            ? "Recently Deleted"
            : "All Notes"}
    </h2>
  </div>
)}


      {!hasNotes && (
        <div className="text-center mt-5" style={{ color: "white", paddingTop: "5rem" }}>
          <p>Nothing to display here</p>
        </div>
      )}

      <div className="row">
        {sortedNotes.map((note) => (
          <NotesItems key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default Notes;
