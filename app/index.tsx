import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../src/lib/supabase";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return <Redirect href={hasSession ? "/(tabs)" : "/(auth)/login"} />;
}
