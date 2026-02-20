import { useRouter } from "next/router";
import { useState } from "react";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password || !token) return;

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword: password,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("✅ Password reset successful");
      router.push("/login");
    } else {
      alert("❌ Invalid or expired reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-sm bg-slate-900 p-6 rounded-xl border border-slate-700">
        <h2 className="text-xl font-semibold mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-slate-800 border border-slate-700"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 transition p-2 rounded font-medium"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
