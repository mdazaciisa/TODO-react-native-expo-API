import { TaskForm } from "@/components/tasks/task-form";
import Button from "@/components/ui/button";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useTodos } from "@/hooks/useTodos";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/context/auth-context";

export default function AddTaskScreen() {
  const { user } = useAuth();
  const { createTodo } = useTodos();
  const { uploadImage, uploading, error: uploadError } = useImageUpload();
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

    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      //reducir tamaño y peso de la imagen
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        image.uri,
        [
          { resize: { width: 1024 } },
        ],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setPhotoUri(manipulatedImage.uri);
    }
  }, []);

  const handleCreateTask = async () => {
    if (!user || !user.token) return;
    if (!title.trim()) {
      Alert.alert("Nombre de la tarea requerido", "Ingresa el nombre de la tarea");
      return;
    }
    if (!photoUri) {
      Alert.alert("Foto requerida", "Agrega una imagen para la tarea.");
      return;
    }

    setIsSaving(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert("Permiso", "Activa la ubicación para registrar la tarea.");
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          "Ubicación desactivada",
          "Activa los servicios de ubicación del dispositivo o emulador."
        );
        return;
      }

      // Coordenadas por defecto para desarrollo en caso de que falle el GPS
      let location = {
        latitude: -33.4489, // Santiago (fallback)
        longitude: -70.6693,
      };

      try {
        const coordinates = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        location = {
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        };
      } catch (locationError) {
        // Silenciar error y usar ubicación por defecto
      }

      // Primero subimos la imagen al backend para obtener la URL pública
      const imageUrl = await uploadImage(user.token, photoUri);

      // Luego creamos la tarea asociando la URL retornada
      await createTodo(title.trim(), imageUrl, location);

      Alert.alert("Éxito", `Libro agregado correctamente. URL de imagen: ${imageUrl}`);
      router.replace("/(tabs)/");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "No pudimos guardar la tarea.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 12, color: "#374151", textAlign: "center" }}>Agregar tarea</Text>

      <View style={styles.container}>
        <TaskForm
          title={title}
          setTitle={setTitle}
          photoUri={photoUri}
          handleTakePhoto={handleTakePhoto}
          isSaving={isSaving || uploading}
          handleCreateTask={handleCreateTask}
        />

        {uploadError ? (
          <Text style={styles.errorText}>{uploadError}</Text>
        ) : null}
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
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginTop: 8,
  },
});
