
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
  Keyboard,
  useColorScheme,
  View,
} from 'react-native';
import { TodoComponent } from './components/todoComponent';
import { TodoModel } from './model/todoModel';
import { getDBConnection, getTodoItems, saveTodoItems, createTable, deleteTodoItem } from './model/db-service';
import logger from './utils/logger';
import { IconButton, Colors } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const App = () => {

  // Theme
  const isDarkMode = useColorScheme() === 'dark';

  // State variables
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('D');
  const [priorityItems, setpriorityItems] = useState([
    {label: '🔴', value: 'A'},
    {label: '🟢', value: 'B'},
    {label: '🔵', value: 'C'},
    {label: '⚫', value: 'D'}
  ]);
  const [open, setOpen] = useState(false);


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

  // Sort function for todos
  const compareTodo = (a: TodoModel, b: TodoModel) => {

    if (a.priority < b.priority)
      return -1;

    if (a.priority == b.priority) {
      
      if (a.id < b.id)
        return -1;

      if (a.id == b.id)
        return 0;

      if (a.id > b.id)
        return 1;
    }

    if (a.priority > b.priority)
      return 1;

    return 0;
  }

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
        priority: priority
      };

      // Add item and sort on id & pririty
      const newTodos = [...todos, newElement];
      newTodos.sort(compareTodo);


      setTodos(newTodos);

      // Save to DB
      const db = await getDBConnection();
      await saveTodoItems(db, newTodos);
      setNewTodo('');

      Keyboard.dismiss();

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
        style={styles.keyboardAvoidingStyle}>

        <View style={{ flex: 3, paddingHorizontal: 5}} >
        <TextInput style={styles.input} placeholder={'Write a task'} value={newTodo} onChangeText={text => setNewTodo(text)} />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 5}} >

          {/* ref: https://hossein-zare.github.io/react-native-dropdown-picker-website/docs/usage */}
          <DropDownPicker
            style={styles.priorityDropdown}
            open={open}
            value={priority}
            items={priorityItems}
            setOpen={setOpen}
            setValue={setPriority} // Ignore ts error
            setItems={setpriorityItems}
            placeholder={priorityItems[0].label}
            dropDownDirection="TOP"
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 5}} > 
        <IconButton 
            icon="plus"
            style={styles.addButton}
            color={Colors.grey600}
            size={20}
            onPress={addTodo}
            />  
        </View>      
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
  keyboardAvoidingStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 50,
    marginHorizontal: 20,
  },
  input: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  priorityDropdown: {
    width: '100%',
    borderColor: '#C0C0C0',
  },
  addWrapper: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addButton: {
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
});

export default App;
