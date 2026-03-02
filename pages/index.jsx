import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { apiFetch } from "../lib/api";

/* ================= PREMIUM BUTTON ================= */
function PremiumButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-full
                 border border-white/20 bg-white/5 text-white backdrop-blur-md
                 transition-all duration-300 active:translate-y-[1px]"
    >
      {/* rotating subtle edge shimmer */}
      <div className="absolute inset-0 rounded-full p-[1px] opacity-0 
                      group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-full
                        animate-[spin_4s_linear_infinite]
                        bg-[conic-gradient(from_0deg,transparent,rgba(255, 255, 255, 0.4),transparent)]" />
      </div>

      {/* inner surface */}
      <div className="relative z-10 rounded-full bg-white/5 py-3
                      shadow-[inset_0_-6px_10px_rgba(255,255,255,0.08)]
                      group-hover:shadow-[inset_0_-6px_14px_rgba(255,255,255,0.15)]
                      transition-all duration-300">
        <span className="text-sm lg:text-base font-medium tracking-tight">
          {children}
        </span>
      </div>
    </button>
  );
}

export default function Home() {
  const router = useRouter();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  /* ================= LOGIN ================= */
  const handlePasswordLogin = async () => {
    if (!form.email || !form.password) {
      alert("Email and password required");
      return;
    }

    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
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
    if (!form.email || !form.username || !form.password || !form.confirmPassword) {
      alert("All fields required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        username: form.username,
        password: form.password,
      }),
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
  <div className="min-h-screen flex items-center justify-center 
                  bg-gradient-to-br from-[#0b1220] to-[#0f172a] text-white">

    <div className="w-full max-w-lg px-6">
      <div className="bg-[#0f172a] border border-white/10 
                      rounded-2xl p-12
                      shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-[28px] font-light tracking-[0.5px]">
            <span className="italic text-slate-400">Skill</span>
            <span className="font-semibold text-white">Mutant</span>
          </h1>
          <p className="text-slate-500 text-xs mt-2">
            AI Skill Intelligence Platform
          </p>
        </div>

        {/* Toggle */}
        <div className="flex mb-8 bg-[#0b1220] rounded-full p-1 border border-white/10">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full text-sm transition ${
              mode === "login"
                ? "bg-[#1e293b] text-white"
                : "text-slate-500 hover:text-white"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-full text-sm transition ${
              mode === "register"
                ? "bg-[#1e293b] text-white"
                : "text-slate-500 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        <div className="space-y-5">

          {/* Email */}
          <input
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-[#0b1220]
                       border border-white/10
                       focus:border-white/30
                       outline-none transition"
            value={form.email}
            onChange={handleChange}
          />

          {/* Username (Register Only) */}
          {mode === "register" && (
            <input
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl bg-[#0b1220]
                         border border-white/10
                         focus:border-white/30
                         outline-none transition"
              value={form.username}
              onChange={handleChange}
            />
          )}

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-[#0b1220]
                         border border-white/10
                         focus:border-white/30
                         outline-none transition"
              value={form.password}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-sm text-slate-500 
                         cursor-pointer hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* Confirm Password (Register Only) */}
          {mode === "register" && (
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-xl bg-[#0b1220]
                           border border-white/10
                           focus:border-white/30
                           outline-none transition"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-3 text-sm text-slate-500 
                           cursor-pointer hover:text-white"
              >
                {showConfirm ? "Hide" : "Show"}
              </span>
            </div>
          )}

          {/* Forgot Password (Login Only) */}
          {mode === "login" && (
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-xs text-slate-400 hover:text-white transition"
              >
                Forgot password?
              </a>
            </div>
          )}

          {/* Primary Button */}
          <button
            onClick={mode === "login" ? handlePasswordLogin : handleRegister}
            className="w-full py-3 rounded-xl
                       bg-white text-black
                       hover:bg-slate-200
                       transition
                       font-medium"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

          {/* Google (Login Only) */}
          {mode === "login" && (
            <>
              <div className="my-6 text-center text-xs text-slate-500">
                OR
              </div>

              <button
                onClick={() => signIn("google")}
                className="w-full py-3 rounded-xl
                           border border-white/10
                           hover:bg-white/5
                           transition"
              >
                Continue with Google
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  </div>
);}