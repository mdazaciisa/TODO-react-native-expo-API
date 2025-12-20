import { imageService } from "@/services/image.service";
import { useState } from "react";

interface UseImageUploadResult {
  uploading: boolean;
  error: string | null;
  uploadImage: (token: string, localUri: string) => Promise<string>;
}

export function useImageUpload(): UseImageUploadResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (token: string, localUri: string): Promise<string> => {
    setUploading(true);
    setError(null);
    try {
      const url = await imageService.uploadImage(token, localUri);
      return url;
    } catch (err: any) {
      console.error("Error al subir imagen", err);
      const status = err?.status;

      if (status && status >= 500) {
        setError("Error del servidor al subir la imagen.");
      } else if (status === 401 || status === 403) {
        setError("No autorizado para subir imágenes (token inválido).");
      } else {
        setError(err?.message || "Error al subir la imagen.");
      }
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    uploadImage,
  };
}
