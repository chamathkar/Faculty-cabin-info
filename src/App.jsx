import { useLocation, NavLink, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import FacultyList from "./pages/FacultyList.jsx";
import SearchFaculty from "./pages/SearchFaculty.jsx";
import FacultyDetail from "./pages/FacultyDetail.jsx";

export default function App() {
  const location = useLocation();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-indigo-50 via-violet-50 to-white flex flex-col">
      {/* HEADER */}
      <header
        className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500/90 backdrop-blur border-b border-violet-200 shadow-lg w-full"
        style={{ height: "80px" }}
      >
        <div className="w-full px-6 sm:px-10 py-6 flex items-center justify-between h-full relative">
          {/* LEFT — Logo (hidden on small screens) */}
          <NavLink
            to="/"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow hover:opacity-90 transition-opacity hidden sm:block"
            style={{ marginLeft: "2%" }}
          >
            Where's sir?😄
          </NavLink>

          {/* CENTER — Navigation (always visible) */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-4 sm:gap-6 text-lg sm:text-xl">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-white/90 text-indigo-700 shadow"
                    : "text-white hover:bg-white/20 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-white/90 text-indigo-700 shadow"
                    : "text-white hover:bg-white/20 hover:text-white"
                }`
              }
            >
              Search
            </NavLink>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full px-4 sm:px-6 py-8 sm:py-10 flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-60vw", opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                >
                  <FacultyList />
                </motion.div>
              }
            />
            <Route
              path="/search"
              element={
                <motion.div
                  initial={{ x: "60vw", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-60vw", opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <SearchFaculty />
                </motion.div>
              }
            />
            <Route path="/faculty/:id" element={<FacultyDetail />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer
        className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500/90 border-t border-violet-200 shadow-lg flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 py-4 sm:py-0 gap-3"
        style={{ minHeight: "80px" }}
      >
        <span className="text-white text-base sm:text-lg font-medium text-center sm:text-left">
          &copy; {year} Where's sir?😄- Now available with faculty rating
        </span>

        {/* <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-8 items-center">
          <span className="text-white text-base sm:text-lg font-medium">
            Connect with us:
          </span>

          <a
            href="https://www.linkedin.com/in/chamathkar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-indigo-200 text-base sm:text-lg font-medium transition"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
              alt="LinkedIn"
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
            Chamathkar
          </a>

          <a
            href="https://www.linkedin.com/in/aditya-pranihith-keerthy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-indigo-200 text-base sm:text-lg font-medium transition"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
              alt="LinkedIn"
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
            Aditya
          </a>
        </div> */}
        <div className="text-white text-base sm:text-lg font-medium text-center sm:text-left">Powered by    
          <a href="https://access-papers.vercel.app/homepage.html"><strong>    PYQ NEST:</strong></a> know their cabin, rate their style!!!
        </div>
      </footer>
    </div>
  );
}
