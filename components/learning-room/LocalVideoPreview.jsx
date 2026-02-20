import { useEffect, useRef } from "react";

export default function LocalVideoPreview({ onStreamReady }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    async function init() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      // 🔥 expose stream to parent
      onStreamReady(stream);
    }

    init();

    // 🔥 CLEANUP when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-96 h-72 rounded-lg border border-slate-600 object-cover"
    />
  );
}
