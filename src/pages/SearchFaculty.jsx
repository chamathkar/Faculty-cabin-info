import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { facultyData } from "../data/facultyData.js";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchFaculty() {
  const query = useQuery();
  const navigate = useNavigate();
  const initial = query.get("name") ?? "";
  const [term, setTerm] = useState(initial);

  useEffect(() => {
    const params = new URLSearchParams();
    if (term) params.set("name", term);
    navigate({ search: params.toString() }, { replace: true });
  }, [term, navigate]);

  const match = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return null;
    return facultyData.find((f) => f.name.toLowerCase().includes(t)) || null;
  }, [term]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700 drop-shadow mb-2">
            🔍 Instantly Find Any Faculty Cabin!
          </h1>
          <p className="text-base text-violet-600">
            Start typing a faculty name and unlock their location in seconds.
          </p>
        </div>
        <Link
          to="/"
          className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50 transition-colors"
        >
          Back
        </Link>
      </div>

      <div className="relative flex items-center my-6">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Type a name to see details."
          className="w-full md:w-2/3 lg:w-1/2 h-16 pl-16 pr-6 text-xl rounded-2xl shadow-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-300 ease-in-out bg-white hover:shadow-xl ml-0"
          style={{
            transition: "box-shadow 0.3s, border-color 0.3s, background 0.3s",
            marginLeft: 0,
          }}
        />
      </div>

      {term.trim() === "" ? (
        <p className="text-sm text-gray-600">
          Start typing to search for a faculty member.
        </p>
      ) : match ? (
        <Link to={`/faculty/${match.id}`} key={match.id}>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6 hover:shadow-lg transition cursor-pointer">
            <img
              src={match.image}
              alt={match.name}
              className="w-20 h-20 object-cover rounded-2xl"
            />
            <div className="flex-1">
              <div className="text-xl font-bold text-indigo-800">
                {match.name}
              </div>
              <div className="text-gray-600">School: {match.school}</div>
              <div className="text-sm text-indigo-600">
                Email: {match.email}
              </div>
            </div>
            <div className="text-indigo-700 font-medium">
              Cabin: {match.cabin}
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center text-gray-600">
          No faculty found.
        </div>
      )}
    </div>
  );
}
