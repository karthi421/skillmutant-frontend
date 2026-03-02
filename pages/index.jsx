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
  <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

    {/* Background */}
    <div
      className="absolute inset-0 -z-10 
      bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]"
    />

    {/* Centered Card Wrapper */}
    <div className="w-full max-w-md px-6">
      <div className="rounded-2xl bg-[#111827]/70 backdrop-blur-xl 
                      border border-white/10 shadow-2xl p-10">

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
        <div className="flex mb-8 bg-[#141417] rounded-full p-1 border border-neutral-700">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full text-sm transition ${
              mode === "login" ? "bg-white text-black" : "text-neutral-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-full text-sm transition ${
              mode === "register" ? "bg-white text-black" : "text-neutral-400"
            }`}
          >
            Register
          </button>
        </div>

        <div className="space-y-4">

          <input
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-[#141417]
                       border border-neutral-700 outline-none focus:border-white"
            value={form.email}
            onChange={handleChange}
          />

          {mode === "register" && (
            <input
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-[#141417]
                         border border-neutral-700 outline-none focus:border-white"
              value={form.username}
              onChange={handleChange}
            />
          )}

          {/* PASSWORD */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-[#141417]
                         border border-neutral-700 outline-none focus:border-white"
              value={form.password}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-sm text-neutral-400 cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {mode === "register" && (
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-lg bg-[#141417]
                           border border-neutral-700 outline-none focus:border-white"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-3 text-sm text-neutral-400 cursor-pointer"
              >
                {showConfirm ? "Hide" : "Show"}
              </span>
            </div>
          )}

          <PremiumButton
            onClick={mode === "login" ? handlePasswordLogin : handleRegister}
          >
            {mode === "login" ? "Login" : "Create Account"}
          </PremiumButton>

          {mode === "login" && (
            <>
              <div className="my-6 text-center text-xs text-neutral-500">OR</div>
              <PremiumButton onClick={() => signIn("google")}>
                Continue with Google
              </PremiumButton>
            </>
          )}

        </div>
      </div>
    </div>
  </div>
);
}