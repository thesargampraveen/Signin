import TodoService from '../services/TodoService';
import { Todo } from '../types/todo';

// This is a test utility to verify TodoService functionality
// You can run this in a development environment or for testing

export const testTodoService = async (): Promise<void> => {
  try {
    console.log('Testing TodoService...');

    // Test creating a todo
    const newTodo = await TodoService.createTodo({
      title: 'Test Todo',
      description: 'This is a test todo item',
      completed: false,
    });
    console.log('Created todo:', newTodo);

    // Test getting all todos
    const todos = await TodoService.getTodos();
    console.log('All todos:', todos);

    // Test updating a todo
    const updatedTodo = await TodoService.updateTodo(newTodo.id, {
      title: 'Updated Test Todo',
      completed: true,
    });
    console.log('Updated todo:', updatedTodo);

    // Test toggling completion
    const toggledTodo = await TodoService.toggleTodoComplete(newTodo.id, false);
    console.log('Toggled todo:', toggledTodo);

    // Test searching
    const searchResults = await TodoService.searchTodos('test');
    console.log('Search results:', searchResults);

    // Test filtering by status
    const activeTodos = await TodoService.getTodosByStatus(false);
    console.log('Active todos:', activeTodos);

    // Clean up - delete test todo
    await TodoService.deleteTodo(newTodo.id);
    console.log('Test todo deleted successfully');

    console.log('TodoService test completed successfully!');
  } catch (error) {
    console.error('TodoService test failed:', error);
    throw error;
  }
};

// Export for use in debugging or testing
export default testTodoService;