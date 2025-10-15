import { useParams, useNavigate } from "react-router-dom";
import { facultyData } from "../data/facultyData.js";

export default function FacultyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const faculty = facultyData.find((f) => String(f.id) === String(id));

  if (!faculty) {
    return (
      <div className="text-center text-indigo-700 mt-20 font-sans">
        Faculty not found.
        <button
          className="ml-4 px-4 py-2 bg-indigo-600 rounded text-white"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans bg-gradient-to-br from-indigo-50 via-violet-50 to-white px-6 py-10 overflow-hidden"
      style={{ height: "100vh" }}
    >
      <button
        className="mb-8 text-lg text-indigo-600 hover:text-violet-700 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <span className="text-2xl">&lt;</span> Back
      </button>
      <div className="flex flex-col md:flex-row gap-10 items-start max-w-5xl mx-auto">
        <div className="w-full md:w-2/5 flex-shrink-0">
          <img
            src={faculty.avatar}
            alt={faculty.name}
            className="w-full aspect-square rounded-2xl object-cover shadow-lg border-4 border-indigo-100 bg-indigo-50"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6 text-indigo-800">
            {faculty.name}
          </h1>
          <div className="mb-8">
            <span className="font-semibold text-indigo-900 text-2xl">
              Cabin:
            </span>{" "}
            <span className="text-violet-700 text-2xl">{faculty.cabin}</span>
          </div>
          <div className="mb-8">
            <span className="font-semibold text-indigo-900 text-2xl">
              School:
            </span>{" "}
            <span className="text-violet-700 text-2xl">{faculty.school}</span>
          </div>
          <div className="mb-8">
            <span className="font-semibold text-indigo-900 text-2xl">
              Email:
            </span>{" "}
            <span className="text-violet-700 text-2xl">{faculty.email}</span>
          </div>
          {/* Add more faculty info here if available */}
        </div>
      </div>
    </div>
  );
}
