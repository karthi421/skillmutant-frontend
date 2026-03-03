import { useEffect, useRef, useState } from "react";
import { logActivity } from "../../lib/logActivity";
import { apiFetch } from "../../lib/api";
import { jwtDecode } from "jwt-decode";
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
  //const userIdRef = useRef("user_" + Math.random().toString(36).slice(2, 8));
  //const USER_ID = userIdRef.current;
  

const token = localStorage.getItem("token");
const decoded = token ? jwtDecode(token) : null;

const USER_ID = decoded?.id;
const USER_NAME = decoded?.name;
const USER_AVATAR = decoded?.profile_image;
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
  const [controlsVisible, setControlsVisible] = useState(true);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [mediaStatus, setMediaStatus] = useState({});
  const [spotlightId, setSpotlightId] = useState(null);
 const [networkQuality, setNetworkQuality] = useState({});
 const [activeSpeaker, setActiveSpeaker] = useState(null);
 const [handsRaised, setHandsRaised] = useState({});
  const [reactions, setReactions] = useState([]);
  const [showReactions, setShowReactions] = useState(false);
  const [memberProfiles, setMemberProfiles] = useState({});
  const [showParticipants, setShowParticipants] = useState(false);
  useEffect(() => {
  if (!USER_ID) return;

  setMemberProfiles({
    [USER_ID]: {
      name: USER_NAME,
      avatar: USER_AVATAR
    }
  });
}, []);
  const sendReaction = (emoji) => {
  const reaction = {
    id: Date.now() + Math.random(),
    emoji,
    from: USER_ID,
  };

  // Show locally instantly
  setReactions(prev => [...prev, reaction]);

  // Broadcast to room
  socketRef.current?.send(
    JSON.stringify({
      type: "reaction",
      emoji,
      from: USER_ID,
    })
  );

  // Auto remove
  setTimeout(() => {
    setReactions(prev =>
      prev.filter(r => r.id !== reaction.id)
    );
  }, 2000);
};

const toggleHand = () => {
  const raised = !handsRaised[USER_ID];

  setHandsRaised(prev => ({
    ...prev,
    [USER_ID]: raised,
  }));

  socketRef.current?.send(JSON.stringify({
    type: "hand",
    from: USER_ID,
    raised,
  }));
};
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
  useEffect(() => {
  if (!localStreamRef.current) return;

  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const micSource = audioContext.createMediaStreamSource(localStreamRef.current);
  micSource.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);

  const detect = () => {
    analyser.getByteFrequencyData(data);
    const volume = data.reduce((a, b) => a + b) / data.length;

    if (volume > 40) {
      setActiveSpeaker(USER_ID);

      socketRef.current?.send(JSON.stringify({
        type: "speaking",
        from: USER_ID,
      }));
    }

    requestAnimationFrame(detect);
  };

  detect();
}, [mediaReady]);

useEffect(() => {
  let timeout;

  const showControls = () => {
    setControlsVisible(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setControlsVisible(false);
    }, 4000);
  };

  window.addEventListener("mousemove", showControls);
  showControls();

  return () => {
    window.removeEventListener("mousemove", showControls);
    clearTimeout(timeout);
  };
}, []);
  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    if (!mediaReady) return;

const baseUrl =
    process.env.NEXT_PUBLIC_AI_BACKEND_URL ||
    "http://localhost:8000";

  const wsUrl = baseUrl
    .replace(/^https/, "wss")
    .replace(/^http/, "ws");

  const fullUrl = `${wsUrl}/ws/rooms/${roomId}?token=${token}`;

  console.log("Connecting to:", fullUrl);

  const socket = new WebSocket(fullUrl);
  socketRef.current = socket;

  socket.onopen = () => {
    console.log("Room connected ✅");
    logActivity("learning_room", "Joined Learning Room");
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  socket.onmessage = async (event) => {
    console.log("WS MESSAGE:", event.data);
      const msg = JSON.parse(event.data);
if (msg.type === "init") {
  const capped = msg.members.slice(0, 8);

  setMembers(capped);

  // Create peers using member.id
  capped.forEach(member => {
    const id = String(member.id);
    if (id !== USER_ID) {
      createPeer(id, false);
    }
  });
}

  // Fetch profiles for members
 

  // ✅ Log learning room join to backend

 apiFetch("/api/jobs/learning-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      roomId: roomId,
    }),
  }).catch(err => console.error("Room log failed:", err));


      if (msg.type === "user-joined") {
  setMembers(prev =>
    prev.length < 8 && !prev.some(m => m.id === msg.user.id)
      ? [...prev, msg.user]
      : prev
  );

  createPeer(String(msg.user.id), true);
}

      if (msg.type === "offer"){
         console.log("Received offer from:", msg.from); 
        handleOffer(msg);
      }
      if (msg.type === "speaking") {
        setActiveSpeaker(msg.from);

      setTimeout(() => {
        setActiveSpeaker(null);
          }, 800);
      }
      if (msg.type === "hand") {
  setHandsRaised(prev => ({
    ...prev,
    [msg.from]: msg.raised,
  }));
}
      if (msg.type === "answer") {
        console.log("Received answer from:", msg.from);
        await peersRef.current[msg.from]?.setRemoteDescription(msg.answer);
      }
      if (msg.type === "reaction") {
          const reaction = {
        id: Date.now() + Math.random(),
        emoji: msg.emoji,
      from: msg.from,
      };

      setReactions(prev => [...prev, reaction]);

    // Auto remove after 2 seconds
      setTimeout(() => {
      setReactions(prev =>
      prev.filter(r => r.id !== reaction.id)
      );
      }, 2000);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/ai/room-chat`, {
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
const renderTile = (id) => {
  const isLocal = id === USER_ID;

  // 🔹 Find member object
  const member = members.find(m => m.id === id);

  const stream = isLocal
    ? (screenOn ? screenStreamRef.current : localStreamRef.current)
    : remoteStreams[id];

  const camEnabled = mediaStatus[id]?.cam !== false;
  const micEnabled = mediaStatus[id]?.mic !== false;

  return (
    <div
      onDoubleClick={() => {
        if (spotlightId === id) {
          setSpotlightId(null); // Exit spotlight
        } else {
          setSpotlightId(id);   // Enter spotlight
        }
      }}
      className={`relative w-full h-full bg-black rounded-2xl overflow-hidden
        transition-all duration-300 cursor-pointer
        ${activeSpeaker === id
          ? "ring-2 ring-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.6)]"
          : ""}
      `}
    >
      {/* ===== VIDEO ===== */}
      {stream && camEnabled ? (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          ref={el => attachStream(el, stream)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
          📷 Camera Off
        </div>
      )}

      {/* ===== NAME LABEL ===== */}
      <div className="absolute top-2 left-2 bg-black/60 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
        {isLocal ? "You" : member?.name || id}
      </div>

      {/* ===== MIC OFF ===== */}
      {!micEnabled && (
        <div className="absolute bottom-3 right-3 bg-red-600 p-2 rounded-full text-sm">
          🔇
        </div>
      )}

      {/* ===== RAISED HAND ===== */}
      {handsRaised[id] && (
        <div className="absolute top-2 right-2 text-xl animate-bounce">
          ✋
        </div>
      )}
    </div>
  );
};
  /* ================= UI ================= */
 return (
  <div
    className="h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white flex flex-col overflow-hidden relative"
    onMouseMove={() => {
      setControlsVisible(true);
      clearTimeout(window.controlTimeout);
      window.controlTimeout = setTimeout(() => {
        setControlsVisible(false);
      }, 2500);
    }}
  >

    {/* ================= HEADER ================= */}
    <header className="h-14 px-6 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-cyan-400">
          SkillMutant Learning Arena
        </span>
        <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded">
          INTERVIEW MODE
        </span>
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-400">
        <span>{mm}:{ss} | {members.length}/8</span>
      </div>
      <button
  onClick={() => setShowParticipants(prev => !prev)}
  className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20"
>
  👥 Participants
</button>
    </header>


    {/* ================= FLOATING REACTIONS ================= */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {reactions.map(r => (
        <div
          key={r.id}
          className="absolute text-4xl animate-float"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            bottom: "20%",
          }}
        >
          {r.emoji}
        </div>
      ))}
    </div>


    {/* ================= MAIN ================= */}
    <main className="flex flex-1 overflow-hidden relative">
     {showParticipants && (
  <div className="absolute right-0 top-14 bottom-0 w-80 bg-black/80 backdrop-blur-xl p-4">
    <h3 className="text-lg mb-4 text-cyan-400">
      Participants ({members.length})
    </h3>

    {members.map(id => {
      const profile = memberProfiles[id];

      return (
        <div key={id} className="flex items-center gap-3 mb-3 p-2 bg-white/5 rounded-xl">
          <img
            src={profile?.avatar || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">
              {profile?.name || id}
            </p>
          </div>
        </div>
      );
    })}
  </div>
)}

      {/* ================= VIDEO AREA ================= */}
      <section className="flex-1 p-4 overflow-hidden">

        {spotlightId ? (
          <div className="h-full flex flex-col gap-4">

            {/* Spotlight */}
            <div className="flex-1">
              {renderTile(spotlightId)}
            </div>

            {/* Thumbnails */}
            <div className="h-32 flex gap-4 overflow-x-auto">
              {members
                .filter(member => member.id !== spotlightId)
                .map(member => (
                  <div
                    key={id}
                    className="w-40 flex-shrink-0"
                    onClick={() => setSpotlightId(id)}
                  >
                    {renderTile(id)}
                  </div>
                ))}

              <button
                onClick={() => setSpotlightId(null)}
                className="px-4 rounded-xl bg-black/60 text-sm"
              >
                Exit Spotlight
              </button>
            </div>

          </div>
        ) : (
          <div className={`grid ${gridCols} gap-4 h-full`}>
            {members.map(id => (
              <div key={id}>
                {renderTile(id)}
              </div>
            ))}
          </div>
        )}

      </section>


      {/* ================= SIDEBAR ================= */}
      <aside className="w-80 border-l border-white/10 bg-black/50 backdrop-blur-lg flex flex-col">

        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActivePanel("notes")}
            className={`flex-1 py-3 text-sm ${activePanel === "notes" ? "bg-white/10" : ""}`}
          >
            📝 Notes
          </button>

          <button
            onClick={() => setActivePanel("ai")}
            className={`flex-1 py-3 text-sm ${activePanel === "ai" ? "bg-white/10" : ""}`}
          >
            🤖 AI
          </button>
        </div>

        {activePanel === "notes" && (
          <div className="flex flex-col flex-1 p-4">
            <textarea
              value={notes}
              onChange={e => { setNotes(e.target.value); setNotesDirty(true); }}
              className="flex-1 bg-black border border-slate-700 rounded p-3 text-sm"
              placeholder="Write collaborative notes..."
            />
            {notesDirty && (
              <button
                onClick={saveRoomNotes}
                className="mt-3 bg-emerald-500 text-black py-2 rounded"
              >
                💾 Save Notes
              </button>
            )}
          </div>
        )}

        {activePanel === "ai" && (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto p-4 text-sm space-y-3">
              {aiMessages.map((m, i) => (
                <div key={i} className={m.role === "assistant" ? "text-cyan-400" : ""}>
                  <b>{m.role === "user" ? "Q:" : "AI:"}</b> {m.content}
                </div>
              ))}
            </div>

            <div className="p-4 flex gap-2 border-t border-white/10">
              <input
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askAI()}
                className="flex-1 bg-black border border-slate-700 rounded px-3 py-2 text-sm"
                placeholder="Ask AI..."
              />
              <button
                onClick={askAI}
                disabled={!aiInput.trim()}
                className="bg-cyan-500 text-black px-4 rounded disabled:opacity-50"
              >
                Ask
              </button>
            </div>
          </div>
        )}

      </aside>

    </main>


    {/* ================= CONTROL CENTER ================= */}
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 
      transition-all duration-500
      ${controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

      <div className="flex items-center gap-4 
                      bg-black/70 backdrop-blur-2xl 
                      border border-white/10
                      px-6 py-4 rounded-3xl
                      shadow-[0_20px_60px_rgba(0,0,0,0.8)]">

        {/* Mic */}
        <button
          onClick={toggleMic}
          className={`w-12 h-12 flex items-center justify-center rounded-full 
          transition hover:scale-110
          ${micOn ? "bg-slate-700" : "bg-red-500"}`}
        >
          🎤
        </button>

        {/* Cam */}
        <button
          onClick={toggleCam}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition
          ${camOn ? "bg-slate-700" : "bg-red-500"}`}
        >
          📷
        </button>

        {/* Screen */}
        <button
          onClick={screenOn ? stopScreenShare : startScreenShare}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition
          ${screenOn ? "bg-emerald-500" : "bg-slate-700"}`}
        >
          🖥
        </button>

        {/* Raise Hand */}
        <button
          onClick={toggleHand}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition
          ${handsRaised[USER_ID] ? "bg-yellow-400 text-black" : "bg-slate-700"}`}
        >
          ✋
        </button>

        <div className="h-8 w-px bg-white/10" />

        {/* Reaction Button */}
        <div className="relative">
          <button
            onClick={() => setShowReactions(prev => !prev)}
            className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center hover:scale-110 transition"
          >
            😊
          </button>

          {showReactions && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2
                            bg-black/80 backdrop-blur-xl
                            border border-white/10
                            px-4 py-3 rounded-2xl
                            flex gap-3 shadow-xl">

              {["👍","👏","🎉","🔥","❤️","😂","💯"].map(e => (
                <button
                  key={e}
                  onClick={() => {
                    sendReaction(e);
                    setShowReactions(false);
                  }}
                  className="text-2xl hover:scale-125 transition"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-white/10" />

        {/* Leave */}
        <button
          onClick={handleLeave}
          className="bg-red-600 p-3 rounded-full hover:scale-110 transition"
        >
          ⏻
        </button>

      </div>
    </div>

  </div>
);
}
