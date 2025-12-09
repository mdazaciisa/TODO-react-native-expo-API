import { TaskForm } from "@/components/tasks/task-form";
import Button from "@/components/ui/button";
import { Task } from "@/constants/types";
import { todoService } from "@/services/todo.service";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/context/auth-context";

export default function AddTaskScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Resetear los campos cada vez que se entra al formulario
      setTitle("");
      setPhotoUri(null);
    }, [])
  );


  const handleTakePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara para tomar la foto.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  }, []);

  const handleCreateTask = async () => {
    if (!user || !user.token) return;
    if (!title.trim()) {
      Alert.alert("Nombre del libro requerido", "Ingresa el nombre del libro");
      return;
    }
    if (!photoUri) {
      Alert.alert("Foto requerida", "Agrega una imagen del libro para la tarea.");
      return;
    }

    setIsSaving(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert("Permiso", "Activa la ubicación para registrar la tarea.");
        return;
      }

      const coordinates = await Location.getCurrentPositionAsync({});
      const location = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      };

      await todoService.createTodo(user.token, title.trim(), photoUri, location);

      Alert.alert("Éxito", "Libro agregado correctamente.");
      router.replace("/(tabs)/");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "No pudimos guardar el libro.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 12, color: "#374151", textAlign: "center" }}>Agregar libro</Text>

      <View style={styles.container}>
        <TaskForm
          title={title}
          setTitle={setTitle}
          photoUri={photoUri}
          handleTakePhoto={handleTakePhoto}
          isSaving={isSaving}
          handleCreateTask={handleCreateTask}
        />
      </View>

      <Button text="Volver" onPress={() => router.replace("/(tabs)/")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f5fb",
  },
});
