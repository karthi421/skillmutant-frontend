import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function Home() {
  const router = useRouter();

  /* ✅ SINGLE SOURCE OF TRUTH */
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /* ================= PASSWORD LOGIN ================= */
  const handlePasswordLogin = async () => {
    if (!form.email || !form.password) {
      alert("Email and password required");
      return;
    }

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      alert("Server error");
    }
  };

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#0f172a] text-white">
      <div className="w-[420px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl">

        {/* LOGO */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-black font-extrabold text-xl shadow-lg">
            SM
          </div>
          <h1 className="text-2xl font-bold mt-3">
            Skill<span className="text-cyan-400">Mutant</span>
          </h1>
          <p className="text-slate-400 text-sm">
            AI Skill Intelligence Platform
          </p>
        </div>

        {/* EMAIL / PASSWORD LOGIN */}
        <div className="space-y-3">
       
          <input
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
            value={form.email}
            onChange={handleChange}
          />

          <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 outline-none"
              value={form.password}
              onChange={handleChange}
          />

          <button
            onClick={handlePasswordLogin}
            className="w-full py-2 rounded-full font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 text-black"
          >
            Login
          </button>
          <div className="text-right">
  <a
    href="/forgot-password"
    className="text-xs text-cyan-400 hover:underline"
  >
    Forgot password?
  </a>
</div>

        </div>

        <div className="my-6 text-center text-xs text-slate-400">OR</div>

        {/* GOOGLE LOGIN */}
        <button
  onClick={async () => {
    const res = await signIn("google", {
      redirect: false,
    });

    // After Google login → call backend manually
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    const backendRes = await apiFetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        googleId: session.user.sub,
      }),
    });

    const data = await backendRes.json();

    // ✅ STORE JWT (THIS NOW WORKS)
    localStorage.setItem("token", data.token);

    // 🔴 New user → complete account
    if (!data.existing) {
      window.location.href = `/complete-account?email=${session.user.email}`;
    } else {
      window.location.href = "/dashboard";
    }
  }}
  className="w-full py-2 rounded-full bg-white text-black font-semibold"
>
  Register / Continue with Google
</button>

      </div>
    </div>
  );
}
