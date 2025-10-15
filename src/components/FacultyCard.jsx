import { Link } from 'react-router-dom'

export default function FacultyCard({ faculty }) {
  return (
    <Link
      to={`/search?name=${encodeURIComponent(faculty.name)}`}
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        src={faculty.image}
        alt={faculty.name}
        className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-gray-200"
      />
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
          {faculty.name}
        </h3>
        <p className="text-sm text-gray-600">{faculty.school}</p>
        <p className="text-sm text-gray-500">Cabin {faculty.cabin}</p>
      </div>
      <span className="ml-auto text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
    </Link>
  )
}


