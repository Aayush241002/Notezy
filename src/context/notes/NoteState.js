import React from 'react'
import Notescontext from './NoteContext'
import { useState } from 'react'
function NoteState(props) {

    const notesInitial = [];
    const [notes, setnotes] = useState(notesInitial)
const host = process.env.REACT_APP_API_HOST || 'http://localhost:5000';
    const Getnotes = async () => {
        if (!localStorage.getItem("token")) {
            return;
        }
        const response = await fetch(`${host}/api/notes/getnotes`,
            {
                method: 'GET',
                headers: {
                    'authtoken': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            }
        )
        if (response.ok) {
            const json = await response.json();
            setnotes(json);
        } else {
            setnotes([]);
        }
    }
    const addnote = async (title, description, tag, pinned, favourite) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'authtoken': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, tag, pinned, favourite })
        });
        const json = await response.json();
        if (response.ok) {
            setnotes(prevNotes => prevNotes.concat(json));
            return json;
        } else {
            return json;
        }
    };
    const Editnote = async (id, title, description, tag, pinned, favourite) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "authtoken": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description, tag, pinned, favourite })
        });
        const json = await response.json();
        if (response.ok) {
            // update state
            setnotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === id ? { ...note, title, description, tag, pinned, favourite } : note
                )
            );
            return json;
        } else {
            return json;
        }
    };
    const Deletenote = async (id) => {
        const response = await fetch(`${host}/api/notes/deletenote/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'authtoken': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
            }
        )
        const json = await response.json()
        setnotes(prevNotes => prevNotes.filter(note => note._id !== id));
        return json
    }
    const Removenote = async (id) => {
        const response = await fetch(`${host}/api/notes/removenote/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'authtoken': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
            }
        )
        const json = await response.json()
        setnotes(prevNotes =>
            prevNotes.map(note =>
                note._id === id ? { ...note, deleted: true } : note
            )
        );
        return json
    }

    const Restorenote = async (id) => {
        const response = await fetch(`${host}/api/notes/restorenote/${id}`,
            {
                method: 'PUT',
                headers: {
                    'authtoken': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
            }
        )
        const json = await response.json()
        setnotes(prevNotes =>
            prevNotes.map(note =>
                note._id === id ? { ...note, deleted: false } : note
            )
        ); return json
    }

    const summarizeNote = async (text) => {
        try {
            const res = await fetch(`${host}/api/notes/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
                body: JSON.stringify({ text })
            });
            return await res.json();
        } catch (error) {
            console.error("Summarize error:", error);
            return null;
        }
    };
    return (
        <Notescontext.Provider value={{ notes, addnote, Editnote, Deletenote, Removenote, Getnotes, setnotes, summarizeNote, Restorenote }}>
            {props.children}
        </Notescontext.Provider>
    )
}

export default NoteState