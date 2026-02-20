import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Rating from "./Rating.jsx";

export default function FacultyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/faculty")
      .then(res => res.json())
      .then(data => {
        const found = data.find(f => String(f.id) === String(id));
        setFaculty(found);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-indigo-700">
        Loading faculty details...
      </div>
    );
  }

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

  const handleShare = () => {
    const message = `
Faculty Profile
--------------------------
Name: ${faculty.name}
Designation: ${faculty.designation}
School: ${faculty.department}
Cabin: ${faculty.office}
Email: ${faculty.email}

Profile Link:
${window.location.href}

==========================
Shared via "WHERE'S SIR?" — Faculty Cabin Finder
==========================
`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-indigo-50 via-violet-50 to-white px-6 py-10">

      <button
        className="mb-8 text-lg text-indigo-600 hover:text-violet-700 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <span className="text-2xl">&lt;</span> Back
      </button>

      <div className="flex justify-end max-w-5xl mx-auto mb-6">
        <button
          onClick={handleShare}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md flex items-center gap-2"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            className="w-6 h-6"
            alt="whatsapp"
          />
          Share on WhatsApp
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto">

        <div className="w-full md:w-2/5 flex flex-col gap-12">
          <div>
            <img
              src={faculty.photo_url || "/placeholder.png"}
              alt={faculty.name}
              className="w-full aspect-square rounded-2xl object-cover shadow-lg border-4 border-indigo-100 bg-indigo-50"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-6 text-indigo-800">
              {faculty.name}
            </h1>

            <div className="mb-4">
              <span className="font-semibold text-indigo-900 text-2xl">
                Cabin:
              </span>{" "}
              <span className="text-violet-700 text-2xl">
                {faculty.office}
              </span>
            </div>

            <div className="mb-4">
              <span className="font-semibold text-indigo-900 text-2xl">
                Designation:
              </span>{" "}
              <span className="text-violet-700 text-2xl">
                {faculty.designation}
              </span>
            </div>

            <div className="mb-4">
              <span className="font-semibold text-indigo-900 text-2xl">
                School:
              </span>{" "}
              <span className="text-violet-700 text-2xl">
                {faculty.department}
              </span>
            </div>

            <div className="mb-4">
              <span className="font-semibold text-indigo-900 text-2xl">
                Email:
              </span>{" "}
              <span className="text-violet-700 text-2xl">
                {faculty.email}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 self-start">
          <Rating id={id} />
        </div>
      </div>
    </div>
  );
}