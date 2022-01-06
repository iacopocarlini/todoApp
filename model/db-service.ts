
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

  logger.log('INFO', 'DB: Create table ');

  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        title TEXT NOT NULL,
        priority TEXT DEFAULT '${priorities.pop()}'
    );`;

  await db.executeSql(query);
};

export const getTodoItems = async (db: SQLiteDatabase): Promise<TodoModel[]> => {
  
  logger.log('INFO', 'DB: Read: select command');

  try {
    const todoItems: TodoModel[] = [];

    const results = 
    await db.executeSql(`SELECT rowid as id, title, priority FROM ${tableName} ORDER BY priority ASC`);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
        logger.log('INFO', result.rows.item(index));
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error('Select Failed');
  }
};

export const saveTodoItems = async (db: SQLiteDatabase, todoItems: TodoModel[]) => {

  logger.log('INFO', 'DB: Save command');

  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, title) values` +
    todoItems.map(i => `(${i.id}, '${i.title}')`).join(',');
  logger.log('INFO', insertQuery);
  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {

  logger.log('INFO', 'DB: Delete item command');
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  logger.log('INFO', deleteQuery);
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {

  logger.log('INFO', 'DB: Delete table command');
  
  const query = `DROP TABLE ${tableName}`;
  await db.executeSql(query);
};