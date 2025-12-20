import Button from "@/components/ui/button";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from "../components/context/auth-context";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");
    const result = await signIn(email, password);

    if (!result.success) {
      const msg = result.error ?? "Email o contraseña incorrectos";
      setErrorMsg(msg);
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>

        <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()} style={{ alignItems: 'center' }}>
          <Ionicons name="book-outline" size={60} color="#1d4ed8" style={styles.icon} />
        </Animated.View>

        <Animated.Text entering={FadeInUp.delay(400).duration(1000).springify()} style={styles.heading}>
          Bienvenido
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="admin@example.com"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="password1234"
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />

          {errorMsg ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{errorMsg}</Text> : null}
          <TouchableOpacity onPress={() => router.push("/registro")}>
            <Text style={{ color: "#3b82f6", marginTop: 12, marginBottom: 12, textAlign: "center" }}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>

          <Button text="Iniciar sesión" type="login" onPress={handleLogin} />
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexGrow: 1 },
  container: {
    flex: 1,
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 24,
    backgroundColor: "#f7f7f7",
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1f2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    color: "#1f2937",
  },
  buttonContainer: {
    marginTop: 8,
  },
  icon: {
    textAlign: "center",
    maxHeight: 200
  },
});