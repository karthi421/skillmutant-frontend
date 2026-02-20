import { useEffect, useRef, useState } from "react";
import InterviewAvatar from "../components/interview/InterviewAvatar";
import InterviewScore from "../components/interview/InterviewScore";
import InterviewReplay from "../components/interview/InterviewReplay";
import InterviewFeedback from "../components/interview/InterviewFeedback";
import { logActivity } from "../lib/logActivity";



import { useRouter } from "next/router";
import { apiFetch } from "../lib/api";


export default function MockInterviewRoom() {
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);
  const listeningRef = useRef(false);

  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState([]);

  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState([]);

  const [phase, setPhase] = useState("LOADING");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  /* ===============================
     LOAD INTERVIEW DATA
  =============================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem("mockInterviewData");
    if (!raw) {
      setError("Interview data missing. Restart interview.");
      return;
    }

    const data = JSON.parse(raw);
    setJobRole(data.jobRole);
    setCompany(data.company);
    setSkills(data.skills || []);
  }, []);

  /* ===============================
     CAMERA + MIC
  =============================== */
  useEffect(() => {
    if (!jobRole || !company) return;

    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        }

        fetchQuestion([]);
      } catch {
        setError("Camera & microphone permission required.");
      }
    };

    startMedia();
  }, [jobRole, company]);

  /* ===============================
     AI SPEAK
  =============================== */
  const speak = (text) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.95;
    u.onend = () => {
      setTimeout(startListening, 600);
    };
    speechSynthesis.speak(u);
  };

  /* ===============================
     HARD RESET MIC
  =============================== */
  const destroyRecognition = () => {
    listeningRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

const startListening = () => {
  if (listeningRef.current) return;

  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SR) {
    setError("Speech recognition not supported.");
    return;
  }

  destroyRecognition();

  const recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    console.log("Recognition REALLY started");
    listeningRef.current = true;
    setPhase("LISTENING");
  };

  /* recognition.onresult = (e) => {
    let text = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      text += e.results[i][0].transcript;
    }
    setTranscript(text);
  }; 
  */
  recognition.onresult = (event) => {
  let interimTranscript = "";
  let finalTranscript = "";

  for (let i = 0; i < event.results.length; i++) {
    const transcriptPart = event.results[i][0].transcript;

    if (event.results[i].isFinal) {
      finalTranscript += transcriptPart + " ";
    } else {
      interimTranscript += transcriptPart + " ";
    }
  }

  setTranscript(finalTranscript + interimTranscript);
};
/*
  recognition.onerror = () => {
    listeningRef.current = false;
  };

  recognition.onend = () => {
    listeningRef.current = false;
  };
*/

recognition.onerror = (event) => {
  console.log("Speech error:", event.error);

  listeningRef.current = false;

  if (event.error === "no-speech") {
    // Auto restart after small delay
    setTimeout(() => {
      if (phase !== "ENDED") {
        startListening();
      }
    }, 700);
  }
};

recognition.onend = () => {
  listeningRef.current = false;

  // Auto restart if interview still running
  if (phase !== "ENDED") {
    setTimeout(() => {
      startListening();
    }, 700);
  }
};

  recognition.start();
  recognitionRef.current = recognition;
};



  /* ===============================
     FETCH QUESTION
  =============================== */
  const fetchQuestion = async (prev) => {
    setPhase("ASKING");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/ai/mock-interview/question`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_role: jobRole,
          company,
          resume_skills: skills,
          previous_answers: prev,
        }),
      }
    );

    const data = await res.json();
    setQuestion(data.question);
    setTranscript("");
    speak(data.question);
  };

  /* ===============================
     SUBMIT ANSWER
  =============================== */
  const submitAnswer = async () => {
    destroyRecognition();
    setPhase("THINKING");

    if (!transcript.trim()) {
      alert("We could not hear you. Please answer again.");
      startListening();
      return;
    }

    const updated = [
      ...answers,
      { question, answer: transcript },
    ];

    setAnswers(updated);
    setTranscript("");
    fetchQuestion(updated);
  };



const endInterview = async () => {
  destroyRecognition();
  streamRef.current?.getTracks().forEach(track => track.stop());
  setPhase("THINKING");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/ai/mock-interview/final-evaluation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_role: jobRole,
          company,
          answers,
          token: localStorage.getItem("token"),
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Evaluation failed");
    }

    const data = await res.json();
    setResult(data);

    // ✅ CALCULATE SCORE FIRST
    const values = Object.values(data.score || {});
    const readinessScore = values.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;

    // ✅ DEFINE BEFORE USE
    const readinessPayload = {
      score: readinessScore,
      breakdown: data.score,
      verdict:
        readinessScore >= 80
          ? "You are interview-ready for most roles."
          : readinessScore >= 60
          ? "You are close to interview-ready. Some improvements needed."
          : "More practice is recommended before interviews.",
    };
    // 🔹 SAVE INTERVIEW FEEDBACK TO DATABASE
await apiFetch("/api/jobs/interviews/feedbacks",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      company,
      role: jobRole,
      score: readinessScore,
      feedback: {
        strengths: data.feedback?.strengths || [],
        weaknesses: data.feedback?.weaknesses || [],
        advice: data.feedback?.advice || [],
      },
    }),
  }
);

    // ✅ SAVE TO JOBS HUB
    const feedbackEntry = {
      id: Date.now(),
      company,
      role: jobRole,
      score: readinessScore,
      breakdown: data.score,
      feedback: data.feedback,
      date: new Date().toISOString(),
    };

    const existing =
      JSON.parse(localStorage.getItem("interviewFeedbacks") || "[]");

    localStorage.setItem(
      "interviewFeedbacks",
      JSON.stringify([feedbackEntry, ...existing])
    );

    // ✅ STORE FOR DASHBOARD
    sessionStorage.setItem(
      "interviewReadiness",
      JSON.stringify(readinessPayload)
    );

    logActivity("interview", "Completed AI mock interview");


    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }

    setPhase("ENDED");
  } catch (err) {
    console.error("END INTERVIEW ERROR:", err);
    setError("Failed to complete interview. Please try again.");
  }
};


  /* ===============================
     END RESULT
  =============================== */
if (phase === "ENDED" && result) {
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      <h2 className="text-2xl font-semibold text-center">
        Interview Completed
      </h2>

      {/* SCORECARD */}
      <InterviewScore score={result.score} />

      {/* ANSWER REPLAY */}
      <InterviewReplay answers={answers} />

      {/* HR FEEDBACK */}
      <InterviewFeedback feedback={result.feedback} />

      {/* 🔹 ACTIONS */}
      <div className="flex justify-center gap-4 mt-8">
        <button
        onClick={() => {
        sessionStorage.removeItem("mockInterviewData");
        //window.location.href = "/student/dashboard";
        router.push("/student");
        }}
      className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-md font-medium"
      >
        ← Back to Dashboard
      </button>


        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-md"
        >
          Retry Interview
        </button>
      </div>
    </div>
  );
}

  /* ===============================
     LOADING
  =============================== */
  if (!jobRole || !company) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Preparing interview…
      </div>
    );
  }

  /* ===============================
     INTERVIEW UI
  =============================== */
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* AI HR */}
      <div className="w-1/2 flex flex-col items-center justify-center border-r border-white/10">
        <InterviewAvatar phase={phase} />

        <p className="mt-6 text-lg text-center max-w-md px-6">
          {question}
        </p>

        <p className="text-xs text-slate-400 mt-3">
          {jobRole} @ {company}
        </p>
      </div>

      {/* USER */}
      <div className="w-1/2 flex flex-col items-center justify-center space-y-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="rounded-xl w-[80%] border border-white/10"
        />

        <div className="w-[80%] bg-black/40 border border-white/10 rounded-md p-3 min-h-[100px]">
          <p className="text-xs text-slate-400 mb-1">Your Answer (live)</p>
          {transcript || "Listening..."}
        </div>

        <div className="flex gap-3">
          <button
            onClick={startListening}
            className="px-4 py-2 bg-slate-700 rounded-md"
          >
            🎤 Restart Mic
          </button>

          <button
            onClick={submitAnswer}
            className="px-6 py-2 bg-cyan-500 rounded-md"
          >
            Submit Answer
          </button>

          <button
            onClick={endInterview}
            className="px-4 py-2 bg-red-500 rounded-md"
          >
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
}
