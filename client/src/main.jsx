import { createRoot } from "react-dom/client";
import AOS from "aos";
import "aos/dist/aos.css";
import App from "./App";
import "./index.css";

AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });

createRoot(document.getElementById("root")).render(<App />);
