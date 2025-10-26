import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Todo } from '../types/todo';
import TodoList, { TodoListRef } from '../components/TodoList';
import TodoForm from '../components/TodoForm';

const TodoScreen: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const todoListRef = useRef<TodoListRef>(null);

  // Track showForm state changes
  React.useEffect(() => {
    console.log('🔄 TodoScreen: showForm state changed to:', showForm);
  }, [showForm]);

  const handleAddTodo = () => {
    setEditingTodo(undefined);
    setShowForm(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleTodoAdded = (todo: Todo) => {
    console.log('📱 TodoScreen: handleTodoAdded called with:', todo.title);
    // Add the todo immediately to the list for instant feedback
    if (todoListRef.current) {
      console.log('✅ TodoScreen: Adding todo to list');
      todoListRef.current.addTodo(todo);
    } else {
      console.log('❌ TodoScreen: todoListRef.current is null');
    }

    // Optional: Show subtle success feedback (can be removed if not needed)
    // The immediate appearance of the todo in the list provides enough feedback
    console.log('🎉 TodoScreen: Todo added successfully:', todo.title);
  };

  const handleCloseForm = () => {
    console.log('🚪 TodoScreen: handleCloseForm called');
    console.log('📱 TodoScreen: Current showForm state:', showForm);
    console.log('❌ TodoScreen: Setting showForm to false');
    setShowForm(false);
    console.log('✅ TodoScreen: handleCloseForm completed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TodoList
        ref={todoListRef}
        style={styles.listContainer}
        onEditTodo={handleEditTodo}
        onTodoAdded={handleTodoAdded}
      />

      <TodoForm
        visible={showForm}
        onTodoAdded={handleTodoAdded}
        onClose={handleCloseForm}

        editingTodo={editingTodo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 26,
  },
  listContainer: {
    flex: 1,
  },
});

export default TodoScreen;