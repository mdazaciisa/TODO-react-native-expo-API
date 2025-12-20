import { API_URL } from "@/constants/config";
import { Task } from "@/constants/types";

export const todoService = {
    async getTodos(token: string): Promise<Task[]> {
        const response = await fetch(`${API_URL}/todos`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            const error: any = new Error("Error al obtener las tareas");
            error.status = response.status;
            error.details = errorText;
            if (response.status === 401 || response.status === 403) {
                error.message = "Sesión expirada o no autorizada al obtener tareas.";
            } else if (response.status >= 500) {
                error.message = "Error del servidor al obtener las tareas.";
            }
            throw error;
        }

        const json = await response.json();
        return json.data || [];
    },

    async createTodo(
        token: string,
        title: string,
        imageUrl: string,
        location: { latitude: number; longitude: number }
    ): Promise<Task> {

        const body = {
            title: title,
            completed: false,
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
            // Guardamos la URL pública retornada por el backend
            photoUri: imageUrl,
        };

        const response = await fetch(`${API_URL}/todos`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            const error: any = new Error(`Error al crear la tarea`);
            error.status = response.status;
            error.details = errorText;
            if (response.status === 401 || response.status === 403) {
                error.message = "Sesión expirada o no autorizada al crear tareas.";
            } else if (response.status >= 500) {
                error.message = "Error del servidor al crear la tarea.";
            } else if (errorText) {
                error.message = `Error al crear la tarea: ${errorText}`;
            }
            throw error;
        }

        const json = await response.json();
        return json.data || json;
    },


    async updateTodo(token: string, id: string, updates: Partial<Task>): Promise<Task> {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            const errorText = await response.text();
            const error: any = new Error("Error al actualizar la tarea");
            error.status = response.status;
            error.details = errorText;
            if (response.status === 401 || response.status === 403) {
                error.message = "Sesión expirada o no autorizada al actualizar tareas.";
            } else if (response.status >= 500) {
                error.message = "Error del servidor al actualizar la tarea.";
            } else if (errorText) {
                error.message = `Error al actualizar la tarea: ${errorText}`;
            }
            throw error;
        }

        const json = await response.json();
        return json.data || json;
    },

    async deleteTodo(token: string, id: string): Promise<void> {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            const error: any = new Error("Error al eliminar la tarea");
            error.status = response.status;
            error.details = errorText;
            if (response.status === 401 || response.status === 403) {
                error.message = "Sesión expirada o no autorizada al eliminar tareas.";
            } else if (response.status >= 500) {
                error.message = "Error del servidor al eliminar la tarea.";
            } else if (errorText) {
                error.message = `Error al eliminar la tarea: ${errorText}`;
            }
            throw error;
        }
    },
};