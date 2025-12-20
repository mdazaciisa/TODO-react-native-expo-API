import { useAuth } from "@/components/context/auth-context";
import { Task } from "@/constants/types";
import { todoService } from "@/services/todo.service";
import { useCallback, useEffect, useState } from "react";

interface UseTodosResult {
  tasks: Task[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  loadTodos: () => Promise<void>;
  createTodo: (
    title: string,
    imageUrl: string,
    location: { latitude: number; longitude: number }
  ) => Promise<void>;
  toggleTodo: (taskId: string) => Promise<void>;
  deleteTodo: (taskId: string) => Promise<void>;
}

export function useTodos(): UseTodosResult {
  const { user, signOut } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = useCallback(
    (err: any, fallbackMessage: string) => {
      console.error("API error:", err);

      const status = err?.status ?? err?.response?.status;

      if (status === 401 || status === 403) {
        setError("Sesión expirada o token inválido. Vuelve a iniciar sesión.");
        // Cerrar sesión si el token ya no es válido
        signOut();
        return;
      }

      const message = err?.message || fallbackMessage;
      setError(message);
    },
    [signOut]
  );

  const loadTodos = useCallback(async () => {
    if (!user?.token) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const fetchedTodos = await todoService.getTodos(user.token);
      setTasks(fetchedTodos);
    } catch (err: any) {
      handleApiError(err, "Error al obtener las tareas");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, handleApiError]);

  const createTodo = useCallback(
    async (
      title: string,
      imageUrl: string,
      location: { latitude: number; longitude: number }
    ) => {
      if (!user?.token) return;

      setIsCreating(true);
      setError(null);
      try {
        const newTask = await todoService.createTodo(
          user.token,
          title,
          imageUrl,
          location
        );
        setTasks((prev: Task[]) => [newTask, ...prev]);
      } catch (err: any) {
        handleApiError(err, "Error al crear la tarea");
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [user?.token, handleApiError]
  );

  const toggleTodo = useCallback(
    async (taskId: string) => {
      if (!user?.token) return;

      const previousTasks: Task[] = [...tasks];
      const taskToUpdate = previousTasks.find((t: Task) => t.id === taskId);
      if (!taskToUpdate) return;

      const updatedTasks = previousTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      );
      setTasks(updatedTasks);

      setIsUpdating(true);
      setError(null);
      try {
        await todoService.updateTodo(user.token, taskId, {
          completed: !taskToUpdate.completed,
        });
      } catch (err: any) {
        // Revertir cambios locales si falla
        setTasks(previousTasks);
        handleApiError(err, "Error al actualizar la tarea");
      } finally {
        setIsUpdating(false);
      }
    },
    [tasks, user?.token, handleApiError]
  );

  const deleteTodo = useCallback(
    async (taskId: string) => {
      if (!user?.token) return;

      const previousTasks: Task[] = [...tasks];
      const updatedTasks = previousTasks.filter((task: Task) => task.id !== taskId);
      setTasks(updatedTasks);

      setIsDeleting(true);
      setError(null);
      try {
        await todoService.deleteTodo(user.token, taskId);
      } catch (err: any) {
        // Revertir cambios locales si falla
        setTasks(previousTasks);
        handleApiError(err, "Error al eliminar la tarea");
      } finally {
        setIsDeleting(false);
      }
    },
    [tasks, user?.token, handleApiError]
  );

  // Cargar tareas automáticamente cuando haya un token válido
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    tasks,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    loadTodos,
    createTodo,
    toggleTodo,
    deleteTodo,
  };
}
