import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchFaculty() {
  const query = useQuery();
  const navigate = useNavigate();
  const initial = query.get("name") ?? "";

  const [term, setTerm] = useState(initial);
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch faculty from API
  useEffect(() => {
    fetch("/api/faculty")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch faculty");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setFacultyData(data);
        } else {
          console.error("Unexpected API response:", data);
          setFacultyData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setFacultyData([]);
        setLoading(false);
      });
  }, []);

  // Sync query param
  useEffect(() => {
    const params = new URLSearchParams();
    if (term) params.set("name", term);
    navigate({ search: params.toString() }, { replace: true });
  }, [term, navigate]);

  // ✅ Return only top 6 matches
  const matches = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return [];

    return facultyData
      .filter((f) =>
        (f?.name || "").toLowerCase().includes(t)
      )
      .slice(0, 6);
  }, [term, facultyData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700 drop-shadow mb-2">
            🔍 Instantly Find Any Faculty Information!
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
          🔎
        </span>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Type a name to see details."
          className="w-full md:w-2/3 lg:w-1/2 h-16 pl-16 pr-6 text-xl rounded-2xl shadow-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-300 ease-in-out bg-white hover:shadow-xl"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading faculty data...</p>
      ) : term.trim() === "" ? (
        <p className="text-sm text-gray-600">
          Start typing to search for a faculty.
        </p>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((faculty) => (
            <Link to={`/faculty/${faculty.id}`} key={faculty.id}>
              <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6 hover:shadow-lg transition cursor-pointer">
                <img
                  src={faculty.photo_url || "/placeholder.png"}
                  alt={faculty.name}
                  className="w-20 h-20 object-cover rounded-2xl border border-indigo-100 shadow"
                />
                <div className="flex-1">
                  <div className="text-xl font-bold text-indigo-800">
                    {faculty.name}
                  </div>
                  <div className="text-gray-600">
                    School: {faculty.department}
                  </div>
                  <div className="text-sm text-indigo-600">
                    Email: {faculty.email}
                  </div>
                </div>
                <div className="text-indigo-700 font-medium">
                  Cabin: {faculty.office}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center text-gray-600">
          No faculty found.
        </div>
      )}
    </div>
  );
}