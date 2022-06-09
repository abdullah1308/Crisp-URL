import "./App.css";
import TitleBar from "./components/TitleBar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Zoom } from "react-toastify";
import ShortenForm from "./components/ShortenForm";
import Footer from "./components/Footer";

function App() {
    return (
        <>
            <ToastContainer
                position="top-center"
                transition={Zoom}
                className="toast-position"
            />
            <TitleBar />
            <ShortenForm />
            <Footer />
        </>
    );
}

export default App;
