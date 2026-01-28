import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabase";
import { useRouter } from "expo-router";

export default function AuthLayout() {
    const [ready, setReady] = useState(false);
    const [hasSession, setHasSession] = useState(false);
    const router = useRouter();

    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) return alert(error.message);

        router.replace("/(auth)/login"); // ✅ force back to login
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setHasSession(!!data.session);
            setReady(true);
        });

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setHasSession(!!session);
        });

        return () => sub.subscription.unsubscribe();
    }, []);

    if (!ready) return null;

    // ✅ Already logged in? Skip auth screens
    if (hasSession) return <Redirect href="/(tabs)" />;

    return <Stack screenOptions={{ headerShown: false }} />;
}
