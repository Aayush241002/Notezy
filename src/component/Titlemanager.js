import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function TitleManager() {
    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case "/deleted":
                document.title = "Recently Deleted";
                break;
            case "/favourites":
                document.title = "Favourites";
                break;
            case "/notes":
                document.title = "My Notes";
                break;
            case "/login":
                document.title = "Login";
                break;
            case "/signup":
                document.title = "Sign Up";
                break;
            case "/":
                document.title = "New Note";
                break;
                            case "/edit":
                document.title = "Edit Note";
                break;
            case "/about":
                document.title = "About Us";
                break;
            case "/contact":
                document.title = "Contact";
                break;
            case "/all":
                document.title = "All Notes";
                break;
                           case "/pinned":
                document.title = "Pinned";
                break;
            default:
                document.title = "Notezy";
        }
    }, [location.pathname]);

    return null;
}

export default TitleManager;
