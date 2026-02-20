import CreateLearningRoom from "./CreateLearningRoom";
import JoinLearningRoom from "./JoinLearningRoom";

export default function LearningRoomSection() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-white">
        Collaborative Learning Rooms
      </h2>

      <p className="text-slate-400 mt-1 mb-6">
        Learn together in small groups with live audio and video.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreateLearningRoom />
        <JoinLearningRoom />
      </div>
    </section>
  );
}
