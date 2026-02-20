import { useRouter } from "next/router";
import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function CompleteAccount() {
  const router = useRouter();
  const { email } = router.query;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    const res = await apiFetch("/api/auth/complete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#0f172a] text-white">
      <div className="w-[420px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-black font-extrabold text-xl shadow-lg">
            SM
          </div>
          <h1 className="text-2xl font-bold mt-3">
            Complete Your Account
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create login credentials for future access
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <input
            value={email || ""}
            disabled
            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-slate-400"
          />

          <input
            placeholder="Choose Username"
            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Create Password"
            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
            onChange={e => setPassword(e.target.value)}
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-2 rounded-full font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:scale-[1.02] transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
