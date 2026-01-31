import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { GradientShell } from "../../src/components/GradientShell";
import { supabase } from "../../src/lib/supabase";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function onSignup() {
    if (password !== confirm) return alert("Passwords do not match.");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // this becomes raw_user_meta_data.full_name
      },
    });

    if (error) return alert(error.message);

    // If email confirmations are ON, session may be null until confirmed.
    alert("Account created! Check your email to confirm (if enabled).");
  }


  return (
    <GradientShell>
      <View style={styles.brand}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoHeart}>♥</Text>
        </View>
        <Text style={styles.title}>Need For Good</Text>
        <Text style={styles.subtitle}>Share your volunteer journey 🌿</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Account</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#7A7A7A"
          style={styles.input}
        />

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

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholder="Confirm your password"
          placeholderTextColor="#7A7A7A"
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={onSignup}>
          <Text style={styles.primaryBtnText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.linkRow}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Log in
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
  logoCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#00A878", alignItems: "center", justifyContent: "center" },
  logoHeart: { color: "white", fontSize: 22, fontWeight: "800" },
  title: { marginTop: 10, fontSize: 30, fontWeight: "800", color: "#00A878" },
  subtitle: { marginTop: 4, color: "#2F2F2F" },

  card: { backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 22, padding: 18 },
  cardTitle: { fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 12 },

  label: { fontSize: 12, color: "#2F2F2F", marginTop: 10, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#BFEBD9", backgroundColor: "#F6FBF8", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 999 },

  primaryBtn: { marginTop: 16, backgroundColor: "#00A878", borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  primaryBtnText: { color: "white", fontWeight: "800" },

  linkRow: { textAlign: "center", marginTop: 12, color: "#2F2F2F" },
  link: { color: "#00A878", fontWeight: "800" },

  divider: { height: 1, backgroundColor: "#EAEAEA", marginVertical: 14 },
  small: { textAlign: "center", color: "#6A6A6A", fontSize: 12 },
});
