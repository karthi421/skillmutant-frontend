import { useRouter } from "next/router";
import CreateLearningRoom from "./CreateLearningRoom";
import JoinLearningRoom from "./JoinLearningRoom";
import LearningVideoRoom from "./LearningVideoRoom";

export default function LearningRoomLobby() {
  const router = useRouter();
  const { room } = router.query;

  if (room) {
    return <LearningVideoRoom roomId={room} />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <CreateLearningRoom />
      <JoinLearningRoom />
    </div>
  );
}
