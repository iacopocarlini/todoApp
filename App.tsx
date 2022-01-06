
import React, { useCallback, useEffect, useState } from 'react';
import {
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
import { getDBConnection, getTodoItems, saveTodoItems, createTable, deleteTodoItem, deleteTable } from './model/db-service';
import logger from './utils/logger';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const loadDataCallback = useCallback(async () => {
    
    try {

      const db = await getDBConnection();
      await createTable(db);
      const storedTodoItems = await getTodoItems(db);

      if (storedTodoItems.length) {
        setTodos(storedTodoItems);
      }

    } catch (error) {
      logger.log('ERROR', error)
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addTodo = async () => {

    if (!newTodo.trim()) 
      return;

    try {

      // Create the new element and add it to the list
      const newElement = {

        id: todos.length ? todos.reduce((acc, cur) => {
          if (cur.id > acc.id)
            return cur;
          return acc;
        }).id+1 : 0, 
        title: newTodo,
        priority: 'D'
      };
      const newTodos = [...todos, newElement];

      setTodos(newTodos);

      // Save to DB
      const db = await getDBConnection();
      await saveTodoItems(db, newTodos);
      setNewTodo('');

    } 
    catch (error) {
      logger.log('ERROR', error);
    }
  };

  const deleteItem = async (id: number) => {

    try {

      // Delete from DB 
      const db = await getDBConnection();
      await deleteTodoItem(db, id);

      // Delete from list
      const newTodos = todos.filter( (value) => { return value.id != id; }); 
      setTodos(newTodos);

    } 
    catch (error) {
      logger.log('ERROR', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.appTitleView}>
          <Text style={styles.appTitleText}> ToDo </Text>
        </View>

      <View style={styles.mainContainer}>
        
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={styles.contentContainer}>

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
        style={styles.writeTaskWrapper}>

        <TextInput style={styles.input} placeholder={'Write a task'} value={newTodo} onChangeText={text => setNewTodo(text)} />
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
        
      </KeyboardAvoidingView>
      </View> 
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex:1,
  },
  mainContainer: {
    flex:1,
    flexDirection: "column"
  },
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800'
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    flexGrow: 1
  },
  tasksWrapper: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  writeTaskWrapper: {
    flex: 0.2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 15,
    //textAlign: 'center',
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
  addText: {
    fontSize: 20
  },
});

export default App;
