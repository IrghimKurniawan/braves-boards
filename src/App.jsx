import { useState } from "react";
import googleIcon from "./assets/google.png";
import gridIcon from "./assets/Grid.png";
import "./index.css";
import { useEffect } from "react";


function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login Dengan: ", { email, password });
    alert(`Login Dengan: ${email}`);
  }
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex items-center justify-center 
  bg-gray-100 dark:bg-gray-900 transition duration-300">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-5 right-5 px-4 py-2 rounded 
  bg-black text-white dark:bg-white dark:text-black"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl">

          <div className="flex items-center justify-center gap-3 mb-2">



            <h1 className="flex items-center justify-center gap-2 text-gray-800 dark:text-white text-lg font-semibold mb-6">
              <span className="grid grid-cols-2 gap-0.5">
                <span className="w-2 h-2 bg-gray-800 dark:bg-white"></span>
                <span className="w-2 h-2 bg-gray-800 dark:bg-white"></span>
                <span className="w-2 h-2 bg-gray-800 dark:bg-white"></span>
                <span className="w-2 h-2 bg-gray-800 dark:bg-white"></span>
              </span>

              <span>
                Braves <span className="text-blue-400">Board</span>
              </span>
            </h1>
          </div>

          {/* Google Sign-in Button */}
          <button className="flex items-center justify-center gap-3 w-full border border-gray-300 py-2.5 px-4 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium text-sm">
            <img src={googleIcon} alt="google" className="w-5 h-5" />
            Sign in with Google
          </button>

        </div>
      </div>
    </div>
  );
}
export default App;