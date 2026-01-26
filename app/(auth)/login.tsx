import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { GradientShell } from "../../src/components/GradientShell";
import { supabase } from "../../src/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  }

  return (
    <GradientShell>
      <View style={styles.brand}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoHeart}>♥</Text>
        </View>
        <Text style={styles.title}>Do Good</Text>
        <Text style={styles.subtitle}>Share your volunteer journey 🌿</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome Back</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your email"
          placeholderTextColor="#7A7A7A"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
          placeholderTextColor="#7A7A7A"
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={onLogin}>
          <Text style={styles.primaryBtnText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.linkRow}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={styles.link}>
            Sign up
          </Link>
        </Text>

        <View style={styles.divider} />

        <Text style={styles.small}>
          Connect your social media accounts after signing in
        </Text>
      </View>
    </GradientShell>
  );
}


const styles = StyleSheet.create({
  brand: { alignItems: "center", marginBottom: 18 },
  logoCircle: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: "#00A878",
    alignItems: "center", justifyContent: "center",
    shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 6 },
  },
  logoHeart: { color: "white", fontSize: 22, fontWeight: "800" },
  title: { marginTop: 10, fontSize: 30, fontWeight: "800", color: "#00A878" },
  subtitle: { marginTop: 4, color: "#2F2F2F" },

  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 22,
    padding: 18,
    shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 12 },
  },
  cardTitle: { fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 12 },

  label: { fontSize: 12, color: "#2F2F2F", marginTop: 10, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#BFEBD9",
    backgroundColor: "#F6FBF8",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: "#00A878",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "800" },

  linkRow: { textAlign: "center", marginTop: 12, color: "#2F2F2F" },
  link: { color: "#00A878", fontWeight: "800" },

  divider: { height: 1, backgroundColor: "#EAEAEA", marginVertical: 14 },
  small: { textAlign: "center", color: "#6A6A6A", fontSize: 12 },
});
