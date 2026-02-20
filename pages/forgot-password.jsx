import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) return;

    setLoading(true);

    await apiFetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-sm bg-slate-900 p-6 rounded-xl border border-slate-700">
        {sent ? (
          <>
            <h2 className="text-xl font-semibold mb-3">
              📩 Check your email
            </h2>
            <p className="text-sm text-slate-400">
              If an account with this email exists, a password reset link has been sent.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Forgot Password
            </h2>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-slate-800 border border-slate-700"
            />

            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 transition p-2 rounded font-medium"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
