import { useEffect, useRef } from "react";

export default function LearningVideoTile({ stream, isLocal }) {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted={isLocal}
      playsInline
      className="rounded border border-slate-700 w-full h-full object-cover"
    />
  );
}
