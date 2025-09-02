import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import NavBar from './component/Navbar';
import NoteState from "./context/notes/NoteState";
import Notes from "./component/Notes";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Addnote from "./component/Addnote";
import About from "./component/About";
import Contact from "./component/Contact";
import { ThemeProvider } from "./context/ThemeContext";
import TitleManager from "./component/Titlemanager";

function App() {
  return (

    <ThemeProvider>

      <NoteState>
        <Router>
               <TitleManager/>

          <NavBar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Addnote />} />
              <Route path="/all" element={<Notes />} />
              <Route path="/pinned" element={<Notes />} />
              <Route path="/favourites" element={<Notes />} />
              <Route path="/deleted" element={<Notes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/edit/:id" element={<Addnote />} />
              <Route path="/about" element={<About />} /> 
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </ThemeProvider>
  );
}
export default App;
// Triggering deploy
