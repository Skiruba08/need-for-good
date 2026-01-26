import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../src/lib/supabase";

export default function ProfileScreen() {
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <TouchableOpacity style={styles.btn} onPress={logout}>
        <Text style={styles.btnText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 14 },
  btn: { backgroundColor: "#0E8F6C", paddingVertical: 14, borderRadius: 999, alignItems: "center" },
  btnText: { color: "white", fontWeight: "900" },
});
