import "../styles/globals.css";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ChatWidget from "../components/chat/ChatWidget";

function AppContent({ Component, pageProps }) {
  const { status } = useSession();
  const router = useRouter();
  const path = router.asPath;
    // 🔥 ADD THIS WAKEUP EFFECT
  useEffect(() => {
    fetch("https://skillmutant-backend.onrender.com/ping")
      .catch(() => {});

    fetch("https://skillmutant-backend.onrender.com/warmup")
      .catch(() => {});
  }, []);
  // Hide chatbot when:
  // 1. User is NOT authenticated
  // 2. On room or mockinterview pages
  const hideChat =
    status !== "authenticated" ||
    path.startsWith("/room") ||
    path.startsWith("/mockinterview");

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
