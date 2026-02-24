import "../styles/globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChatWidget from "../components/chat/ChatWidget";

function AppContent({ Component, pageProps }) {
  const { status } = useSession();
  const router = useRouter();
  const path = router.asPath;

  const [warmingUp, setWarmingUp] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🔥 Ensure client-side only
useEffect(() => {
  setMounted(true);

  const wakeBackend = async () => {
    setWarmingUp(true);

    try {
      await Promise.all([
        fetch("https://skillmutant-backend.onrender.com/ping"),
        fetch("https://skillmutant-backend.onrender.com/warmup"),
      ]);
    } catch (err) {
      console.error("Warmup failed:", err);
    } finally {
      setWarmingUp(false);
    }
  };

  wakeBackend();
}, []);

  const hideChat =
    status !== "authenticated" ||
    path.startsWith("/room") ||
    path.startsWith("/mockinterview");

  // 🔥 Only show spinner in browser (not during SSR build)
  if (mounted && warmingUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
        <span className="ml-4">Waking up server...</span>
      </div>
    );
  }

  return (
    <>
      <Component {...pageProps} />
      {!hideChat && <ChatWidget />}
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AppContent Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}