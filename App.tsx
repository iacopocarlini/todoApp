
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { TodoComponent } from './components/todoComponent';
import { TodoModel } from './model/todoModel';
import { getDBConnection, getTodoItems, saveTodoItems, createTable, deleteTodoItem } from './model/db-service';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const loadDataCallback = useCallback(async () => {
    try {
      const initTodos = [
        {id: 0, title: 'go to shop'},
        {id: 1, title: 'eat at least a one healthy foods'},
        {id: 2, title: 'Do some exercises'},
      ];
      const db = await getDBConnection();
      await createTable(db);
      const storedTodoItems = await getTodoItems(db);
      if (storedTodoItems.length) {
        setTodos(storedTodoItems);
      } else {
        await saveTodoItems(db, initTodos);
        setTodos(initTodos);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const newTodos = [...todos, {
        id: todos.length ? todos.reduce((acc, cur) => {
          if (cur.id > acc.id)
            return cur;
          return acc;
        }).id + 1 : 0, title: newTodo
      }];
      setTodos(newTodos);
      const db = await getDBConnection();
      await saveTodoItems(db, newTodos);
      setNewTodo('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const db = await getDBConnection();
      await deleteTodoItem(db, id);
      todos.splice(id, 1);
      setTodos(todos.slice(0));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <View style={[styles.appTitleView]}>
          <Text style={styles.appTitleText}> ToDo </Text>
        </View>

        {/* Todo List*/}
        <View style={styles.tasksWrapper}>
          {todos.map((todo) => (
            <TodoComponent key={todo.id} todo={todo} deleteItem={deleteItem} />
          ))}
        </View>

        </ScrollView>

         {/* Write a task */}
        {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <TextInput style={styles.input} placeholder={'Write a task'} value={newTodo} onChangeText={text => setNewTodo(text)} />
          <TouchableOpacity onPress={addTodo}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800'
  },
  container: {
    flex: 1,
  },
  tasksWrapper: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});

export default App;
