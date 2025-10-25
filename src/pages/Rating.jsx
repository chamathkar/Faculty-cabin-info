import React, { useState, useEffect } from "react";
import { Star, Users } from "lucide-react";
import { db } from "../firebase.js";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const Rating = ({ id }) => {
  const [attendanceRating, setAttendanceRating] = useState(0);
  const [correctionRating, setCorrectionRating] = useState(0);
  const [teachingRating, setTeachingRating] = useState(0);

  const [avgAttendance, setAvgAttendance] = useState(0);
  const [avgCorrection, setAvgCorrection] = useState(0);
  const [avgTeaching, setAvgTeaching] = useState(0);

  const [count, setCount] = useState(0); // total number of users rated
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [alreadyRated, setAlreadyRated] = useState(false);

  const ratingsRef = doc(db, "facultyRatings", id);

  useEffect(() => {
    const hasRated = localStorage.getItem(`rated_${id}`);
    if (hasRated) setAlreadyRated(true);
    loadRatings();
  }, [id]);

  const loadRatings = async () => {
    setLoading(true);
    try {
      const docSnap = await getDoc(ratingsRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAvgAttendance(data.avgAttendance || 0);
        setAvgCorrection(data.avgCorrection || 0);
        setAvgTeaching(data.avgTeaching || 0);
        setCount(data.count || 0);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNewAverage = (currentAvg, currentCount, newRating) => {
    const total = currentAvg * currentCount + newRating;
    return total / (currentCount + 1);
  };

  const handleSubmit = async () => {
    if (alreadyRated) {
      setMessage("You have already submitted a rating from this device.");
      return;
    }

    if (attendanceRating === 0 || correctionRating === 0 || teachingRating === 0) {
      setMessage("Please provide all ratings before submitting.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const docSnap = await getDoc(ratingsRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentCount = data.count || 0;

        const newAvgAttendance = calculateNewAverage(data.avgAttendance || 0, currentCount, attendanceRating);
        const newAvgCorrection = calculateNewAverage(data.avgCorrection || 0, currentCount, correctionRating);
        const newAvgTeaching = calculateNewAverage(data.avgTeaching || 0, currentCount, teachingRating);

        await updateDoc(ratingsRef, {
          count: increment(1),
          avgAttendance: newAvgAttendance,
          avgCorrection: newAvgCorrection,
          avgTeaching: newAvgTeaching,
          lastUpdated: new Date().toISOString(),
        });

        setAvgAttendance(newAvgAttendance);
        setAvgCorrection(newAvgCorrection);
        setAvgTeaching(newAvgTeaching);
        setCount(currentCount + 1);
      } else {
        await setDoc(ratingsRef, {
          count: 1,
          avgAttendance: attendanceRating,
          avgCorrection: correctionRating,
          avgTeaching: teachingRating,
          lastUpdated: new Date().toISOString(),
        });

        setAvgAttendance(attendanceRating);
        setAvgCorrection(correctionRating);
        setAvgTeaching(teachingRating);
        setCount(1);
      }

      localStorage.setItem(`rated_${id}`, "true");
      setAlreadyRated(true);

      setAttendanceRating(0);
      setCorrectionRating(0);
      setTeachingRating(0);
      setMessage("Ratings submitted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting ratings:", error);
      setMessage("Error submitting ratings. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, setRating, label }) => (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-indigo-900 mb-3">{label}</label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !alreadyRated && setRating(star)}
            className={`focus:outline-none transform transition hover:scale-110 ${
              alreadyRated ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Star
              size={28}
              className={star <= rating ? "fill-violet-500 text-violet-500" : "text-gray-300"}
            />
          </button>
        ))}
        <span className="ml-3 text-xl font-semibold text-indigo-800">{rating > 0 ? rating : ""}</span>
      </div>
    </div>
  );

  const AverageDisplay = ({ label, average, count }) => {
    let textColor = "text-gray-800";
    if (average > 0) {
      if (average < 2.5) textColor = "text-red-500";
      else if (average >= 2.5 && average < 3.5) textColor = "text-yellow-500";
      else if (average >= 3.5) textColor = "text-green-500";
    }
    return (
      <div className="text-center bg-indigo-50 p-4 rounded-lg shadow-sm">
        <div className="text-sm text-indigo-600 mb-2">{label}</div>
        <div className="flex items-center justify-center gap-2">
          <Star size={20} className="fill-violet-500 text-violet-500" />
          <span className={`text-2xl font-bold ${textColor}`}>
            {average > 0 ? average.toFixed(2) : "—"}
          </span>
        </div>
        <div className="flex items-center justify-center mt-1 gap-1 text-gray-500 text-sm">
          <Users size={16} />
          <span>{count || 0}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-48 flex items-center justify-center">
        <div className="text-indigo-600 text-lg">Loading Ratings...</div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-6">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6">Rating System</h2>

      {/* Average Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AverageDisplay label="Attendance" average={avgAttendance} count={count} />
        <AverageDisplay label="Correction" average={avgCorrection} count={count} />
        <AverageDisplay label="Teaching" average={avgTeaching} count={count} />
      </div>

      {/* Rating Inputs */}
      <StarRating rating={attendanceRating} setRating={setAttendanceRating} label="Attendance" />
      <StarRating rating={correctionRating} setRating={setCorrectionRating} label="Correction" />
      <StarRating rating={teachingRating} setRating={setTeachingRating} label="Teaching" />

      {/* Message */}
      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded text-sm ${
            message.includes("Error") || message.includes("Please")
              ? "bg-red-50 text-red-500 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting || alreadyRated}
        className="w-full py-2.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {alreadyRated ? "Already Rated" : submitting ? "Submitting..." : "Submit Ratings"}
      </button>

      {/* Bottom Note */}
      <div className="mt-6 text-center text-sm text-gray-700 border-t pt-4">
        ⚠️ You can only rate once per faculty, so be careful and provide genuine rating only.
      </div>
    </div>
  );
};

export default Rating;
