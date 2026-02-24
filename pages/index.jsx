import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { apiFetch } from "../lib/api";

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

        {/* FORM */}
        <div className="space-y-4">

          <input
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-[#111111]
                       border border-neutral-700 outline-none focus:border-white"
            value={form.email}
            onChange={handleChange}
          />

          {mode === "register" && (
            <input
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-[#111111]
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
              className="w-full px-4 py-3 rounded-lg bg-[#111111]
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

          {/* CONFIRM PASSWORD (REGISTER ONLY) */}
          {mode === "register" && (
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-lg bg-[#111111]
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

          {/* MAIN BUTTON */}
          <button
            onClick={mode === "login" ? handlePasswordLogin : handleRegister}
            className="w-full py-3 rounded-full bg-white text-black
                       font-medium transition-all duration-300
                       hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

          {/* GOOGLE ONLY FOR LOGIN */}
          {mode === "login" && (
            <>
              <div className="my-6 text-center text-xs text-neutral-500">OR</div>

              <button
                onClick={() => signIn("google")}
                className="w-full py-3 rounded-full
                           bg-[#111111] border border-neutral-700
                           text-white font-medium
                           hover:border-white transition"
              >
                Continue with Google
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}