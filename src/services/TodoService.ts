import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Todo } from '../types/todo';

export type TodoListener = (todos: Todo[]) => void;

class TodoService {
  private get collection() {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return firestore().collection('users').doc(user.uid).collection('todos');
  }

  // Create a new todo
  async createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    const now = new Date();
    const newTodo: Omit<Todo, 'id'> = {
      ...todo,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.collection.add(newTodo);
    return {
      id: docRef.id,
      ...newTodo,
    };
  }

  // Get all todos for the current user
  async getTodos(): Promise<Todo[]> {
    const snapshot = await this.collection
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Todo));
  }

  // Get a single todo by ID
  async getTodoById(id: string): Promise<Todo | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()!.createdAt.toDate(),
      updatedAt: doc.data()!.updatedAt.toDate(),
    } as Todo;
  }

  // Update a todo
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await this.collection.doc(id).update(updateData);

    const updatedTodo = await this.getTodoById(id);
    if (!updatedTodo) {
      throw new Error('Todo not found after update');
    }

    return updatedTodo;
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  // Toggle todo completion status
  async toggleTodoComplete(id: string, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }

  // Search todos by title or description
  async searchTodos(query: string): Promise<Todo[]> {
    if (!query.trim()) {
      return this.getTodos();
    }

    const allTodos = await this.getTodos();
    const lowercaseQuery = query.toLowerCase();

    return allTodos.filter(todo =>
      todo.title.toLowerCase().includes(lowercaseQuery) ||
      (todo.description && todo.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get todos filtered by completion status
  async getTodosByStatus(completed: boolean): Promise<Todo[]> {
    const snapshot = await this.collection
      .where('completed', '==', completed)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Todo));
  }

  // Real-time listeners for instant updates
  subscribeToTodos(listener: TodoListener): () => void {
    const unsubscribe = this.collection
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const todos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate(),
          } as Todo));
          listener(todos);
        },
        (error) => {
          console.error('Error listening to todos:', error);
        }
      );

    return unsubscribe;
  }

  subscribeToTodosByStatus(completed: boolean, listener: TodoListener): () => void {
    const unsubscribe = this.collection
      .where('completed', '==', completed)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const todos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate(),
          } as Todo));
          listener(todos);
        },
        (error) => {
          console.error('Error listening to filtered todos:', error);
        }
      );

    return unsubscribe;
  }
}

export default new TodoService();