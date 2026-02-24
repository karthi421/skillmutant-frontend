import { useRouter } from "next/router";
import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function Home() {
  const router = useRouter();

  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /* ================= LOGIN ================= */
  const handlePasswordLogin = async () => {
    if (!form.email || !form.password) {
      alert("Email and password required");
      return;
    }

    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!data?.token) {
      alert(data?.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    if (!form.email || !form.password) {
      alert("Email and password required");
      return;
    }

    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!data?.success) {
      alert(data?.error || "Registration failed");
      return;
    }

    alert("Account created successfully");
    setMode("login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#111111] text-white">

      {/* DASHBOARD BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#181818] via-[#111111] to-[#1c1c1c]" />

      <div className="w-[440px] p-10 rounded-2xl bg-[#1c1c1c] border border-neutral-800 shadow-xl">

        {/* LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-2xl italic tracking-widest -skew-x-6 font-light">
            Skill<span className="font-semibold">Mutant</span>
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            AI Skill Intelligence Platform
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex mb-8 bg-[#111111] rounded-full p-1 border border-neutral-700">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full text-sm transition ${
              mode === "login"
                ? "bg-white text-black"
                : "text-neutral-400"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-full text-sm transition ${
              mode === "register"
                ? "bg-white text-black"
                : "text-neutral-400"
            }`}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <input
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-[#111111]
                       border border-neutral-700
                       outline-none focus:border-white
                       transition"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-[#111111]
                       border border-neutral-700
                       outline-none focus:border-white
                       transition"
            value={form.password}
            onChange={handleChange}
          />

          {/* SHIMMER INSPIRED BUTTON */}
          <button
            onClick={
              mode === "login"
                ? handlePasswordLogin
                : handleRegister
            }
            className="group relative w-full py-3 rounded-full
                       bg-black text-white border border-white/20
                       overflow-hidden transition-all duration-300"
          >
            <span className="relative z-10 font-medium">
              {mode === "login" ? "Login" : "Create Account"}
            </span>

            {/* shimmer layer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_linear_infinite]" />
            </div>
          </button>

          {mode === "login" && (
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-xs text-neutral-400 hover:text-white transition"
              >
                Forgot password?
              </a>
            </div>
          )}

        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

    </div>
  );
}