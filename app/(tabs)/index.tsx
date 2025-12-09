import { TaskList } from "@/components/tasks/task-list";
import { Header } from "@/components/ui/header";
import { Task } from "@/constants/types";
import { todoService } from "@/services/todo.service";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/context/auth-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const reloadTasks = useCallback(async () => {
    if (!user || !user.token) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const fetchedTodos = await todoService.getTodos(user.token);
      setTasks(fetchedTodos);
    } catch (err) {
      console.error("Error reloading tasks:", err);
      // Optional: Show error to user
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reloadTasks();
  }, [reloadTasks]);

  useFocusEffect(
    useCallback(() => {
      reloadTasks();
    }, [reloadTasks])
  );

  const handleToggleTask = async (taskId: string) => {
    if (!user?.token) return;

    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    // Optimistic update
    const previousTasks = [...tasks];
    const updated = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);

    try {
      await todoService.updateTodo(user.token, taskId, { completed: !taskToUpdate.completed });
    } catch (error) {
      console.error("Error updating task:", error);
      // Revert on error
      setTasks(previousTasks);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user?.token) return;

    // Optimistic update
    const previousTasks = [...tasks];
    const updated = tasks.filter((task) => task.id !== taskId);
    setTasks(updated);

    try {
      await todoService.deleteTodo(user.token, taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      // Revert on error
      setTasks(previousTasks);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Biblioteca de ${user?.name}`} />

      <TaskList
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5fb",
    padding: 24,
    paddingBottom: 0,
  },
});
