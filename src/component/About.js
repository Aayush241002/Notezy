import React from "react";

function About() {
  return (
    <div className="container justify-content-center main-content">
      <h1 style={{ fontWeight: "700", fontSize: "2.2rem", marginBottom: "1.5rem" }}>
        About This App
      </h1>

      <p style={{ fontSize: "1.1rem", lineHeight: "1.7rem", color: "#d1d5db" , overflowWrap: "break-word",
    wordWrap: "break-word",
    whiteSpace: "normal", }}>
        Welcome to <strong>My Notebook</strong> – your personal note-taking app.  
        It lets you create, edit, delete, pin, and favourite notes with ease.  
        All your notes are securely stored and can be accessed anytime once you log in.
      </p>

      <h3 style={{ marginTop: "2rem", fontWeight: "600" }}>✨ Features</h3>
      <ul style={{ fontSize: "1rem", color: "#d1d5db", lineHeight: "1.6rem" }}>
        <li>Create, edit and delete notes instantly.</li>
        <li>Pin important notes to keep them at the top.</li>
        <li>Mark notes as favourites for quick access.</li>
        <li>Organize notes by tags like Work, Ideas, Personal, etc.</li>
        <li>Secure authentication – your notes are private.</li>
      </ul>

      <h3 style={{ marginTop: "2rem", fontWeight: "600" }}>Why My-Notebook?</h3>
      <p style={{ fontSize: "1rem", color: "#d1d5db", lineHeight: "1.6rem" }}>
        Unlike traditional note apps, iNotebook is built with modern MERN stack technologies,  
        offering smooth performance, user-friendly UI, and secure storage.
      </p>

      <h3 style={{ marginTop: "2rem", fontWeight: "600" }}>Developer</h3>
      <p style={{ fontSize: "1rem", color: "#d1d5db" }}>
        Built with using <strong>React, Express, MongoDB, and Node.js</strong>.  
        Designed to help you stay organized and productive.
      </p>
    </div>
  );
}

export default About;
