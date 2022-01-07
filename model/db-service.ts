
import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { TodoModel } from '../model/todoModel';
import logger from '../utils/logger';

const tableName = 'todoData';
const priorities: String[]  = ['A', 'B', 'C', 'D'];

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'todo-data.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {

  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
                  id INTEGER PRIMARY KEY,   
                  title TEXT NOT NULL,
                  priority TEXT DEFAULT '${priorities[priorities.length - 1]}'
                  );`;

    logger.log('INFO', query);

  await db.executeSql(query);
};

export const getTodoItems = async (db: SQLiteDatabase): Promise<TodoModel[]> => {

  try {

    const todoItems: TodoModel[] = [];
    const results = await db.executeSql(`SELECT id, title, priority FROM ${tableName} ORDER BY priority ASC`);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
        logger.log('OBJECT', result.rows.item(index));
      }
    });
    return todoItems;

  } catch (error) {
    logger.log('ERROR', error);
    throw Error('Select Failed');
  }
};

export const saveTodoItems = async (db: SQLiteDatabase, todoItems: TodoModel[]) => {

  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName} (id, title, priority) values` +
    todoItems.map(i => `(${i.id}, '${i.title}', '${i.priority}')`).join(',');
  logger.log('INFO', insertQuery);
  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {

  const deleteQuery = `DELETE from ${tableName} where id = ${id}`;
  logger.log('INFO', deleteQuery);
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  
  const query = `DROP TABLE ${tableName}`;
  logger.log('INFO', query);
  await db.executeSql(query);
};