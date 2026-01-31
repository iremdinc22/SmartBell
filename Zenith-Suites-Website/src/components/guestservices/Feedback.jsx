import { useState } from "react";
import { createFeedback } from "@/services/feedbacks";

const Feedback = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [selectedAspects, setSelectedAspects] = useState([]);
  const [otherAspect, setOtherAspect] = useState("");
  const [comments, setComments] = useState("");
  const [stayAgain, setStayAgain] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const aspects = [
    "Room cleanliness",
    "Staff friendliness",
    "Robot check-in/check-out experience",
    "Food & beverages",
    "Facilities (Pool, Spa, Gym, etc.)",
    "Room comfort",
    "Entertainment options",
  ];

  const handleAspectToggle = (aspect) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect) ? prev.filter((a) => a !== aspect) : [...prev, aspect]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      rating,
      tags: selectedAspects,
      other: otherAspect,
      comment: comments,
      stayAgain,
    };

    try {
      await createFeedback(payload);
      setSubmitted(true);

      if (onSubmit) onSubmit(payload);
    } catch (err) {
      console.error("createFeedback error:", err);
      alert("Something went wrong. Please try again.");
    }
  };


  if (submitted) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 p-8 bg-white dark:bg-gray-800 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-black dark:text-white">
          Thank You!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Thank you for your valuable feedback. We hope to welcome you again soon!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-serif text-black dark:text-white text-3xl md:text-4xl font-bold leading-tight">
          Share Your Experience
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base">
          We hope you had a memorable stay at Zenith Suites. Your feedback helps us improve.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Overall Satisfaction */}
        <div className="space-y-4">
          <h2 className="text-black dark:text-white text-xl font-bold leading-tight pb-3 border-b border-gray-200 dark:border-gray-700 font-serif">
            Overall Satisfaction
          </h2>
          <div>
            <p className="text-black dark:text-white text-base pb-3">
              How would you rate your overall stay?
            </p>
            <div className="flex flex-wrap gap-2 justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="flex flex-col items-center gap-2 py-2.5 text-center w-16 cursor-pointer group"
                >
                  <div
                    className={`rounded-full p-3.5 transition-colors ${rating >= star
                        ? "bg-yellow-500"
                        : "bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
                      }`}
                  >
                    <svg
                      className={`w-6 h-6 ${rating >= star ? "text-white" : "text-gray-600 dark:text-gray-400"
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Specific Feedback */}
        <div className="space-y-4">
          <h2 className="text-black dark:text-white text-xl font-bold leading-tight pb-3 border-b border-gray-200 dark:border-gray-700 font-serif">
            Specific Feedback
          </h2>
          <div>
            <p className="text-black dark:text-white text-base pb-3">
              What aspects did you enjoy or would you like to see improved? (Select all that apply)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aspects.map((aspect) => (
                <label
                  key={aspect}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-400 dark:border-gray-500 bg-transparent text-black dark:text-white focus:ring-black dark:focus:ring-white"
                    checked={selectedAspects.includes(aspect)}
                    onChange={() => handleAspectToggle(aspect)}
                  />
                  <span className="text-black dark:text-white">{aspect}</span>
                </label>
              ))}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <label className="text-black dark:text-white whitespace-nowrap" htmlFor="other">
                  Other:
                </label>
                <input
                  id="other"
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-gray-400 dark:border-gray-500 text-black dark:text-white focus:ring-0 focus:border-black dark:focus:border-white"
                  value={otherAspect}
                  onChange={(e) => setOtherAspect(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Open Comments */}
        <div className="space-y-4">
          <h2 className="text-black dark:text-white text-xl font-bold leading-tight pb-3 border-b border-gray-200 dark:border-gray-700 font-serif">
            Open Comments
          </h2>
          <div>
            <label className="text-black dark:text-white text-base pb-3 block" htmlFor="comments">
              Any additional comments or suggestions?
            </label>
            <textarea
              id="comments"
              className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white p-3"
              placeholder="Tell us anything you'd like…"
              rows="5"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        {/* Would You Stay Again? */}
        <div className="space-y-4">
          <h2 className="text-black dark:text-white text-xl font-bold leading-tight pb-3 border-b border-gray-200 dark:border-gray-700 font-serif">
            Would You Stay Again?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {["Yes, definitely", "Maybe", "No"].map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex-1 transition-colors"
              >
                <input
                  type="radio"
                  className="h-5 w-5 border-gray-400 dark:border-gray-500 bg-transparent text-black dark:text-white focus:ring-black dark:focus:ring-white"
                  name="stay-again"
                  checked={stayAgain === option}
                  onChange={() => setStayAgain(option)}
                />
                <span className="text-black dark:text-white">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto flex min-w-[180px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-black dark:bg-white text-white dark:text-black text-base font-bold leading-normal hover:opacity-90 transition-opacity"
          >
            <span className="truncate">Submit Feedback</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;


