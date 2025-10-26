import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Todo } from '../types/todo';
import TodoService from '../services/TodoService';

interface TodoFormProps {
  visible: boolean;
  onClose: () => void;
  onTodoAdded: (todo: Todo) => void;
  editingTodo?: Todo;
}

const TodoForm: React.FC<TodoFormProps> = ({
  visible,
  onTodoAdded,
  onClose,
  editingTodo,
}) => {
  const [title, setTitle] = useState(editingTodo?.title || '');
  const [description, setDescription] = useState(editingTodo?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log('🚀 TodoForm: handleSubmit started');
    if (!title.trim()) {
      console.log('❌ TodoForm: Title validation failed');
      Alert.alert('Error', 'Title is required');
      return;
    }

    console.log('⏳ TodoForm: Setting loading to true');
    setLoading(true);
    try {
      let todo: Todo;

      if (editingTodo) {
        console.log('✏️ TodoForm: Updating existing todo:', editingTodo.id);
        todo = await TodoService.updateTodo(editingTodo.id, {
          title: title.trim(),
          description: description.trim() || undefined,
        });
      } else {
        console.log('➕ TodoForm: Creating new todo');
            onClose();
        todo = await TodoService.createTodo({
          title: title.trim(),
          description: description.trim() || undefined,
          completed: false,
        });
      }

      console.log('✅ TodoForm: Todo saved successfully:', todo.id, todo.title);

      // Close modal immediately for instant response
      console.log('🚪 TodoForm: Calling onClose directly...');
      onClose();

      // Call onTodoAdded after closing
      console.log('📢 TodoForm: Calling onTodoAdded...');
      onTodoAdded(todo);

      // Reset form state
      console.log('🧹 TodoForm: Resetting form state');
      setTitle('');
      setDescription('');
      setLoading(false);

      console.log('🎉 TodoForm: Submit process completed');
    } catch (error) {
      console.error('❌ TodoForm: Error saving todo:', error);
      Alert.alert('Error', 'Failed to save todo');
      setLoading(false);
    }
  };

  const handleClose = () => {
    console.log('🚪 TodoForm: handleClose called');
    console.log('🧹 TodoForm: Clearing form fields');
    setTitle('');
    setDescription('');
    console.log('🔄 TodoForm: Setting loading to false');
    setLoading(false);
    console.log('📞 TodoForm: Calling onClose()');
    onClose();
    console.log('✅ TodoForm: handleClose completed');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          {editingTodo ? 'Edit Todo' : 'Add New Todo'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Todo title"
          value={title}
          onChangeText={setTitle}
          autoFocus
          maxLength={100}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading || !title.trim()}
          >
            <Text style={styles.buttonText}>
              {editingTodo ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TodoForm;