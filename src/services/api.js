export const fetchFaculty = async () => {
  // const res = await fetch("/api/faculty");
  const res = await fetch("http://localhost:3000/api/faculty")

  if (!res.ok) {
    throw new Error("Failed to fetch faculty");
  }

  return res.json();
};
