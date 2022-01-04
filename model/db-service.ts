/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { TodoModel } from '../model/todoModel';

const tableName = 'todoData';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'todo-data.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        title TEXT NOT NULL,
        priority TEXT
    );`;

  await db.executeSql(query);
};

export const getTodoItems = async (db: SQLiteDatabase): Promise<TodoModel[]> => {
  try {
    const todoItems: TodoModel[] = [];
    const results = await db.executeSql(`SELECT rowid as id, title FROM ${tableName}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
        console.log(result);
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const saveTodoItems = async (db: SQLiteDatabase, todoItems: TodoModel[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, title) values` +
    todoItems.map(i => `(${i.id}, '${i.title}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE ${tableName}`;

  await db.executeSql(query);
};