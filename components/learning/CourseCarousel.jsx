import CourseCard from "./CourseCard";

export default function CourseCarousel({ courses, onComplete }) {

  if (!courses?.length) {
    return (
      <p className="text-slate-400 text-sm">
        No courses found. Try another search.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 pb-2">
        {courses.map((course, idx) => (
         <CourseCard
          key={idx}
          course={course}
          onComplete={onComplete || (()=>{})}
        />

        ))}
      </div>
    </div>
  );
}
