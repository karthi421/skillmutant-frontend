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

  const attemptLogin = async () => {
    return await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });
  };

  try {
    const data = await attemptLogin();

    if (!data?.token) {
      alert(data?.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    router.push("/dashboard");

  } catch (err) {
    console.warn("First login attempt failed. Retrying...");

    try {
      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));

      const retryData = await attemptLogin();

      if (!retryData?.token) {
        alert("Invalid credentials");
        return;
      }

      localStorage.setItem("token", retryData.token);
      router.push("/dashboard");

    } catch (retryErr) {
      alert("Server waking up. Please try again.");
    }
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
  <div className="relative min-h-screen flex items-center justify-center bg-[#111111] text-white">

    {/* SAME BACKGROUND AS DASHBOARD */}
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#181818] via-[#111111] to-[#1c1c1c]" />

    <div className="w-[420px] p-10 rounded-2xl bg-[#1c1c1c] border border-neutral-800 shadow-xl">

      {/* LOGO */}
      <div className="text-center mb-8">
        <h1 className="text-2xl italic tracking-widest -skew-x-6 font-light">
          Skill<span className="font-semibold">Mutant</span>
        </h1>

        <p className="text-neutral-400 text-sm mt-2">
          AI Skill Intelligence Platform
        </p>
      </div>

      {/* EMAIL / PASSWORD LOGIN */}
      <div className="space-y-4">

        <input
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg bg-[#111111]
                     border border-neutral-700
                     outline-none focus:border-white
                     transition-colors duration-200"
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
                     transition-colors duration-200"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={handlePasswordLogin}
          className="w-full py-3 rounded-full font-medium
                     bg-white text-black
                     transition-all duration-300
                     hover:-translate-y-1
                     hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
        >
          Login
        </button>

        <div className="text-right">
          <a
            href="/forgot-password"
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Forgot password?
          </a>
        </div>

      </div>

      <div className="my-8 text-center text-xs text-neutral-500">OR</div>

      {/* GOOGLE LOGIN */}
      <button
        onClick={async () => {
          const res = await signIn("google", { redirect: false });

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

          localStorage.setItem("token", data.token);

          if (!data.existing) {
            window.location.href = `/complete-account?email=${session.user.email}`;
          } else {
            window.location.href = "/dashboard";
          }
        }}
        className="w-full py-3 rounded-full
                   bg-white text-black font-medium
                   transition-all duration-300
                   hover:-translate-y-1
                   hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
      >
        Register / Continue with Google
      </button>

    </div>
  </div>
);
}
