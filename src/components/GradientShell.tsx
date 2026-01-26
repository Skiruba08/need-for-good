import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export function GradientShell({ children }: { children: ReactNode }) {
  return (
    <LinearGradient
      colors={["#FFF3CC", "#E9FFF4"]}
      style={styles.bg}
      start={{ x: 0.1, y: 0.0 }}
      end={{ x: 0.9, y: 1.0 }}
    >
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  inner: { flex: 1, padding: 20, justifyContent: "center" },
});
