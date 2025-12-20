import { API_URL } from "@/constants/config";

export interface ImageUploadResponse {
  url: string;
}

export const imageService = {
  async uploadImage(token: string, localUri: string): Promise<string> {
    const formData = new FormData();

    // Nombre y tipo básicos; el backend debería aceptar image/jpeg genérico
    const fileName = localUri.split("/").pop() || "photo.jpg";
    const file: any = {
      uri: localUri,
      name: fileName,
      type: "image/jpeg",
    };

    // Enviamos "file" y otros "image"ambos para ser compatibles con la API.
    formData.append("file", file);
    formData.append("image", file);

    const response = await fetch(`${API_URL}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error: any = new Error("Error al subir la imagen");
      error.status = response.status;
      error.details = errorText;

      // Intentar propagar el mensaje real del backend para facilitar el debugging
      try {
        const parsed = JSON.parse(errorText);
        const backendMessage =
          parsed?.message ||
          parsed?.error ||
          parsed?.title ||
          parsed?.detail;

        if (backendMessage && typeof backendMessage === "string") {
          error.message = `Error al subir la imagen: ${backendMessage}`;
        }
      } catch {
        if (errorText) {
          error.message = `Error al subir la imagen: ${errorText}`;
        }
      }

      throw error;
    }

    const json = await response.json();
    const url = json?.data?.url ?? json?.url;

    if (!url) {
      throw new Error("El backend no retornó una URL de imagen válida.");
    }

    return url;
  },
};
