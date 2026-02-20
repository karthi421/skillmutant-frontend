import { useEffect, useRef, useState } from "react";
import { logActivity } from "../../lib/logActivity";

//const ICE_SERVERS = {
//  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//};

const ICE_SERVERS = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
};



export default function VideoRoom({ roomId }) {
  /* ================= USER ================= */
  const userIdRef = useRef("user_" + Math.random().toString(36).slice(2, 8));
  const USER_ID = userIdRef.current;

  /* ================= REFS ================= */
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const currentVideoTrackRef = useRef(null);
  const screenStreamRef = useRef(null);

  const socketRef = useRef(null);
  const peersRef = useRef({});

  /* ================= STATE ================= */
  const [members, setMembers] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [mediaReady, setMediaReady] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);

  const [activePanel, setActivePanel] = useState("notes");
  const [notes, setNotes] = useState("");
  const [notesDirty, setNotesDirty] = useState(false);

  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [mediaStatus, setMediaStatus] = useState({});
 const [networkQuality, setNetworkQuality] = useState({});

  /* ================= TIMER ================= */
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  /* ================= MEDIA ================= */
  useEffect(() => {
    let mounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (!mounted) return;

        localStreamRef.current = stream;
        currentVideoTrackRef.current = stream.getVideoTracks()[0];

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setMediaReady(true);
      })
      .catch(err => {
        console.error("Media error:", err);
      });

    return () => {
      mounted = false;
      localStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    if (!mediaReady) return;

    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/rooms/${roomId}/${USER_ID}`
    );
   socketRef.current.onopen = () => {
  console.log("Room connected ✅");

  // 🔥 LOG ACTIVITY HERE
  logActivity("learning_room", "Joined Learning Room");
};

    socketRef.current.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "init") {
  const capped = msg.members.slice(0, 8);
  setMembers(capped);

  capped.forEach(id => {
    if (id !== USER_ID) {
      createPeer(id, false);
    }
  });

  // ✅ Log learning room join to backend
  fetch("http://localhost:5000/api/jobs/learning-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      roomId: roomId,
    }),
  }).catch(err => console.error("Room log failed:", err));
}

      if (msg.type === "user-joined") {
        setMembers(prev =>
          prev.length < 8 && !prev.includes(msg.user_id)
            ? [...prev, msg.user_id]
            : prev
        );

        //const initiator = USER_ID < msg.user_id;
        createPeer(msg.user_id, true);
      }

      if (msg.type === "offer"){
         console.log("Received offer from:", msg.from); 
        handleOffer(msg);
      }
      if (msg.type === "answer") {
        console.log("Received answer from:", msg.from);
        await peersRef.current[msg.from]?.setRemoteDescription(msg.answer);
      }

      if (msg.type === "ice") {
        await peersRef.current[msg.from]?.addIceCandidate(msg.candidate);
      }

      if (msg.type === "ai-message") {
        setAiMessages(prev => [
          ...prev,
          { role: "assistant", content: msg.content },
        ]);
      }
      if (msg.type === "media-status") {
        setMediaStatus(prev => ({
          ...prev,
          [msg.from]: {
          mic: msg.mic,
          cam: msg.cam,
        }
      }));
      }

      if (msg.type === "user-left") {
        peersRef.current[msg.user_id]?.close();
        delete peersRef.current[msg.user_id];

        setRemoteStreams(prev => {
          const copy = { ...prev };
          delete copy[msg.user_id];
          return copy;
        });

        setMembers(prev => prev.filter(id => id !== msg.user_id));
      }
    };

    return () => socketRef.current?.close();
  }, [mediaReady]);

  /* ================= WEBRTC ================= */
  const createPeer = async (remoteId, initiator) => {
    if (!localStreamRef.current || peersRef.current[remoteId]) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);


    // 📶 Network monitoring
const monitorConnection = () => {
  const interval = setInterval(async () => {
    if (pc.connectionState === "closed") {
      clearInterval(interval);
      return;
    }

    const stats = await pc.getStats();

    stats.forEach(report => {
      // More reliable RTT source
      if (report.type === "remote-inbound-rtp" && report.roundTripTime) {
        const rtt = report.roundTripTime;

        let quality = "good";

        if (rtt < 0.15) quality = "good";
        else if (rtt < 0.3) quality = "medium";
        else quality = "poor";

        setNetworkQuality(prev => ({
          ...prev,
          [remoteId]: quality
        }));
      }
    });
  }, 3000);
};

monitorConnection();

    peersRef.current[remoteId] = pc;

    // Add current video track (camera or screen)
    if (currentVideoTrackRef.current) {
      pc.addTrack(currentVideoTrackRef.current, localStreamRef.current);
    }

    // Add audio tracks
    localStreamRef.current.getAudioTracks().forEach(track =>
      pc.addTrack(track, localStreamRef.current)
    );

    pc.ontrack = e => {
      setRemoteStreams(prev => ({
        ...prev,
        [remoteId]: e.streams[0],
      }));
    };

    pc.onicecandidate = e => {
      if (e.candidate) {
        socketRef.current.send(JSON.stringify({
          type: "ice",
          to: remoteId,
          from: USER_ID,
          candidate: e.candidate,
        }));
      }
    };

    if (initiator) {
      console.log("Creating offer for:", remoteId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("Sending offer to:", remoteId);

      socketRef.current.send(JSON.stringify({
        type: "offer",
        to: remoteId,
        from: USER_ID,
        offer,
      }));
    }

    pc.onconnectionstatechange = () => {
  console.log("Connection state:", pc.connectionState);
};

pc.oniceconnectionstatechange = () => {
  console.log("ICE state:", pc.iceConnectionState);
};

  };




  const handleOffer = async ({ from, offer }) => {
    if (!localStreamRef.current) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peersRef.current[from] = pc;

    if (currentVideoTrackRef.current) {
      pc.addTrack(currentVideoTrackRef.current, localStreamRef.current);
    }

    localStreamRef.current.getAudioTracks().forEach(track =>
      pc.addTrack(track, localStreamRef.current)
    );

    pc.ontrack = e => {
      setRemoteStreams(prev => ({
        ...prev,
        [from]: e.streams[0],
      }));
    };

    pc.onicecandidate = e => {
      if (e.candidate) {
        socketRef.current.send(JSON.stringify({
          type: "ice",
          to: from,
          from: USER_ID,
          candidate: e.candidate,
        }));
      }
    };

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.send(JSON.stringify({
      type: "answer",
      to: from,
      from: USER_ID,
      answer,
    }));
  };

  /* ================= SCREEN SHARE ================= */
  const replaceVideoTrackForPeers = (track) => {
    Object.values(peersRef.current).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === "video");
      if (sender) sender.replaceTrack(track);
    });
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      screenStreamRef.current = screenStream;
      currentVideoTrackRef.current = screenTrack;

      replaceVideoTrackForPeers(screenTrack);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      setScreenOn(true);

      screenTrack.onended = stopScreenShare;
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  const stopScreenShare = () => {
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current = null;

    const camTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!camTrack) return;

    currentVideoTrackRef.current = camTrack;
    replaceVideoTrackForPeers(camTrack);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    setScreenOn(false);
  };

  /* ================= MIC / CAM ================= */
  const toggleMic = () => {
  const track = localStreamRef.current?.getAudioTracks()[0];
  if (!track) return;

  track.enabled = !track.enabled;
  setMicOn(track.enabled);

  socketRef.current.send(JSON.stringify({
    type: "media-status",
    mic: track.enabled,
    cam: camOn,
  }));
};


  const toggleCam = () => {
  const track = localStreamRef.current?.getVideoTracks()[0];
  if (!track) return;

  track.enabled = !track.enabled;
  setCamOn(track.enabled);

  socketRef.current.send(JSON.stringify({
    type: "media-status",
    mic: micOn,
    cam: track.enabled,
  }));
};

  const handleLeave = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    socketRef.current?.close();
    window.close();
  };

  /* ================= AI ================= */
  const askAI = async () => {
    if (!aiInput.trim()) return;

    const question = aiInput;
    setAiInput("");

    setAiMessages(prev => [...prev, { role: "user", content: question }]);

    try {
      const res = await fetch("http://localhost:8000/ai/room-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: roomId, question, notes }),
      });

      const data = await res.json();
      const answer = data.answer || "AI unavailable.";

      setAiMessages(prev => [...prev, { role: "assistant", content: answer }]);

      socketRef.current.send(JSON.stringify({
        type: "ai-message",
        content: answer,
      }));
    } catch {
      setAiMessages(prev => [...prev, { role: "assistant", content: "AI error." }]);
    }
  };

  /* ================= GRID ================= */
  const tiles = members.length || 1;
  const gridCols =
    tiles <= 2 ? "grid-cols-2" :
    tiles <= 4 ? "grid-cols-2" :
    tiles <= 6 ? "grid-cols-3" :
    "grid-cols-4";
const attachStream = (videoEl, stream) => {
  if (!videoEl || !stream) return;
  if (videoEl.srcObject !== stream) {
    videoEl.srcObject = stream;
  }
};
/* ================= SAVE ROOM NOTES ================= */
const saveRoomNotes = () => {
  if (!notes.trim()) return;

  const stored = JSON.parse(
    localStorage.getItem("notes") || "[]"
  );

  const newNote = {
    title: `Room Notes — ${roomId}`,
    content: notes,
    room: roomId,
    type: "room",
    date: Date.now(),
  };

  // Remove old note for same room (replace behavior)
  const filtered = stored.filter(
    n => !(n.type === "room" && n.room === roomId)
  );

  const updated = [newNote, ...filtered];

  localStorage.setItem("notes", JSON.stringify(updated));

  setNotesDirty(false);
};

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">

      <header className="h-14 px-6 flex justify-between items-center border-b border-white/10">
        <span>Learning Room — <span className="text-slate-400">{roomId}</span></span>
        <span className="text-sm text-slate-400">{mm}:{ss} | {members.length}/8</span>
      </header>

      <main className="flex flex-1">

       <section className={`flex-1 grid ${gridCols} gap-4 p-4 auto-rows-fr`}>
  {members.map(id => {
    const isLocal = id === USER_ID;
    const stream = isLocal
      ? (screenOn ? screenStreamRef.current : localStreamRef.current)
      : remoteStreams[id];

    const camEnabled = mediaStatus[id]?.cam !== false;
    const micEnabled = mediaStatus[id]?.mic !== false;
    const quality = networkQuality[id]; // 👈 from state

    return (
      <div
        key={id}
        className="relative rounded-xl bg-black overflow-hidden flex items-center justify-center"
      >
        {/* 🎥 VIDEO */}
        {stream && camEnabled ? (
          <video
            autoPlay
            playsInline
            muted={isLocal}
            ref={el => attachStream(el, stream)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
            <span className="text-lg">📷 Camera Off</span>
          </div>
        )}

        {/* 🔇 MIC ICON */}
        {!micEnabled && (
          <div className="absolute bottom-3 right-3 bg-red-600 p-2 rounded-full text-white text-sm">
            🔇
          </div>
        )}

        {/* 🏷 USER LABEL */}
        <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
          {isLocal ? "You" : id}
        </div>

        {/* 📶 NETWORK INDICATOR */}
      {!isLocal && (
  <div className="absolute top-2 right-2">
    {networkQuality[id] ? (
      <div
        className={`px-2 py-1 rounded-md text-[10px] font-semibold ${
          networkQuality[id] === "good 📶"
            ? "bg-green-600/90 text-white"
            : networkQuality[id] === "medium 📶"
            ? "bg-yellow-500/90 text-black"
            : "bg-red-600/90 text-white"
        }`}
      >
        {networkQuality[id].toUpperCase()}
      </div>
    ) : (
      <div className="px-2 py-1 rounded-md text-[10px] bg-slate-600 text-white">
        CHECKING..📶
      </div>
    )}
  </div>
)}


      </div>
    );
  })}
</section>



        <aside className="w-80 border-l border-white/10 bg-black/40 p-4 flex flex-col">
          <div className="flex gap-2 mb-3">
            <button onClick={() => setActivePanel("notes")}>📝 Notes</button>
            <button onClick={() => setActivePanel("ai")}>🤖 AI</button>
          </div>

          {activePanel === "notes" && (
            <>
              <textarea
                value={notes}
                onChange={e => { setNotes(e.target.value); setNotesDirty(true); }}
                className="flex-1 bg-black border border-slate-700 rounded p-2"
              />
              {notesDirty && (
               <button
                onClick={saveRoomNotes}
                className="mt-2 bg-emerald-500 text-black py-2 rounded"
              >
                💾 Save Notes
              </button>

              )}
            </>
          )}

          {activePanel === "ai" && (
            <>
              <div className="flex-1 overflow-y-auto text-sm space-y-2">
                {aiMessages.map((m, i) => (
                  <div key={i} className={m.role === "assistant" ? "text-cyan-400" : ""}>
                    <b>{m.role === "user" ? "Q:" : "AI:"}</b> {m.content}
                  </div>
                ))}
              </div>

              <div className="mt-2 flex gap-2">
                <input
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && askAI()}
                  className="flex-1 bg-black border border-slate-700 rounded px-2"
                  placeholder="Ask a doubt…"
                />
                <button
                  onClick={askAI}
                  disabled={!aiInput.trim()}
                  className="bg-cyan-500 text-black px-3 rounded disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
            </>
          )}
        </aside>
      </main>

      <footer className="h-16 flex justify-center gap-6 items-center border-t border-white/10">
        <button onClick={toggleMic} className={micOn ? "bg-slate-700 p-3 rounded-full" : "bg-red-500 p-3 rounded-full"}>🎤</button>
        <button onClick={toggleCam} className={camOn ? "bg-slate-700 p-3 rounded-full" : "bg-red-500 p-3 rounded-full"}>📷</button>
        <button onClick={screenOn ? stopScreenShare : startScreenShare}
          className={screenOn ? "bg-emerald-500 p-3 rounded-full" : "bg-slate-700 p-3 rounded-full"}>
          🖥
        </button>
        <button onClick={handleLeave} className="bg-red-600 p-3 rounded-full">⏻</button>
      </footer>
    </div>
  );
}
