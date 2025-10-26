import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ViewStyle,
} from 'react-native';
import { Todo } from '../types/todo';
import TodoService, { TodoListener } from '../services/TodoService';
import TodoItem from './TodoItem';

export interface TodoListRef {
  addTodo: (todo: Todo) => void;
}

interface TodoListProps {
  style?: ViewStyle;
  onEditTodo?: (todo: Todo) => void;
  onTodoAdded?: (todo: Todo) => void;
}

const TodoList = forwardRef<TodoListRef, TodoListProps>(({ style, onEditTodo, onTodoAdded }, ref) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    subscribeToRealtimeUpdates();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [filter]);

  useEffect(() => {
    applyFilters();
  }, [todos, searchQuery]);

  const subscribeToRealtimeUpdates = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setLoading(true);

    try {
      if (filter === 'all') {
        unsubscribeRef.current = TodoService.subscribeToTodos((updatedTodos) => {
          setTodos(updatedTodos);
          setLoading(false);
        });
      } else {
        const completed = filter === 'completed';
        unsubscribeRef.current = TodoService.subscribeToTodosByStatus(completed, (updatedTodos) => {
          setTodos(updatedTodos);
          setLoading(false);
        });
      }
    } catch (error) {
      console.error('Error setting up real-time updates:', error);
      setLoading(false);
    }
  };

  const loadTodos = async () => {
    setLoading(true);
    try {
      const loadedTodos = await TodoService.getTodos();
      setTodos(loadedTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...todos];

    // Apply status filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(lowercaseQuery) ||
        (todo.description && todo.description.toLowerCase().includes(lowercaseQuery))
      );
    }

    setFilteredTodos(filtered);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleAddTodo = (todo: Todo) => {
    // Add the new todo immediately to the state
    setTodos(prevTodos => [todo, ...prevTodos]);

    // Notify the parent component if callback is provided
    if (onTodoAdded) {
      onTodoAdded(todo);
    }

    // Reset search if active to show the new todo
    if (searchQuery.trim()) {
      setSearchQuery('');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      try {
        const searchResults = await TodoService.searchTodos(query);
        setTodos(searchResults);
      } catch (error) {
        console.error('Error searching todos:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadTodos();
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'completed') => {
    setFilter(newFilter);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No todos yet!</Text>
      <Text style={styles.emptyStateMessage}>
        {filter === 'active' && 'No active todos. Great job!'}
        {filter === 'completed' && 'No completed todos yet.'}
        {filter === 'all' && 'Start by adding your first todo.'}
      </Text>
    </View>
  );

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onUpdate={handleUpdateTodo}
      onDelete={handleDeleteTodo}
      onEdit={onEditTodo || (() => {})}
    />
  );

  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };

  const stats = getStats();

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    addTodo: handleAddTodo,
  }), []);

  return (
    <View style={[styles.container, style]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search todos..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => handleFilterChange('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All ({stats.total})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'active' && styles.activeFilterTab]}
          onPress={() => handleFilterChange('active')}
        >
          <Text style={[styles.filterText, filter === 'active' && styles.activeFilterText]}>
            Active ({stats.active})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'completed' && styles.activeFilterTab]}
          onPress={() => handleFilterChange('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
            Completed ({stats.completed})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={filteredTodos.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTodos} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f8f9fa',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  activeFilterText: {
    color: '#007bff',
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default TodoList;