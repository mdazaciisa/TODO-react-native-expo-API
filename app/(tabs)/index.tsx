import { TaskList } from "@/components/tasks/task-list";
import { Header } from "@/components/ui/header";
import { useTodos } from "@/hooks/useTodos";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/context/auth-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const { tasks, isLoading, error, loadTodos, toggleTodo, deleteTodo } = useTodos();

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [loadTodos])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Todo List" />
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: user?.token ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            {user?.token ? 'API Conectada ✓' : 'API Desconectada ✗'}
          </Text>
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}

      {!!error && !isLoading && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <TaskList
        tasks={tasks}
        onToggleTask={toggleTodo}
        onDeleteTask={deleteTodo}
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
  headerContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    marginVertical: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
});
