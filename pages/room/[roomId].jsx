import { useRouter } from "next/router";
import VideoRoom from "../../components/learning-room/VideoRoom";

export default function RoomPage() {
  const router = useRouter();
  const { roomId } = router.query;

  if (!roomId) return null;

  return <VideoRoom roomId={roomId} />;
}
