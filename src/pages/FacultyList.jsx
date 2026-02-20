import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PAGE_SIZE = 16;

export default function FacultyList() {
  const [facultyData, setFacultyData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/faculty")
      .then(res => res.json())
      .then(data => {
        setFacultyData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(facultyData.length / PAGE_SIZE);

  const pageData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return facultyData.slice(start, start + PAGE_SIZE);
  }, [facultyData, page]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading faculty...</div>;
  }

  return (
    <div className="space-y-6 w-full font-sans">

      {/* Header Section */}
      <div className="flex items-end justify-between gap-4">
        <div className="w-full bg-gradient-to-r from-indigo-100 via-violet-100 to-white rounded-2xl shadow-md px-8 py-6 flex items-center gap-4 border-l-8 border-indigo-400">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700 drop-shadow">
              Where's sir?😄
            </h1>
            <p className="text-base text-violet-600 mt-1">
              Browse the list and click to view details of your faculty.
            </p>
            <span className="text-base text-red-500">
              Note that <strong>APC Faculty</strong> and <strong>Research Scholars</strong> are not included here.
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        {pageData.map((f) => (
          <Link
            to={`/faculty/${f.id}`}
            key={f.id}
            className="w-full aspect-square"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 hover:shadow-2xl border border-violet-100 w-full h-full">
              <div className="w-4/5 aspect-square mb-4">
                <img
                  src={f.photo_url || "/placeholder.png"}
                  alt={f.name}
                  className="w-full h-full object-cover rounded-2xl border-4 border-indigo-100 shadow"
                />
              </div>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">
                {f.name}
              </h3>
              <p className="text-violet-500 mb-2 text-center">
                {f.department}
              </p>
              <span className="text-base text-gray-500 text-center">
                {f.office}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <button
          className={`px-8 py-4 text-lg rounded-lg border transition-colors ${
            canPrev
              ? "bg-white hover:bg-gray-50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          onClick={() => canPrev && setPage((p) => Math.max(1, p - 1))}
          disabled={!canPrev}
        >
          Previous
        </button>

        <div className="text-lg text-gray-600">
          Page {page} of {totalPages || 1}
        </div>

        <button
          className={`px-8 py-4 text-lg rounded-lg border transition-colors ${
            canNext
              ? "bg-white hover:bg-gray-50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          onClick={() => canNext && setPage((p) => Math.min(totalPages, p + 1))}
          disabled={!canNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
