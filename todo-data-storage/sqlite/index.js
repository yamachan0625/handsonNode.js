'use strict';
const { promisify } = require('util');
const { join } = require('path');
const sqlite3 =
  process.env.NODE_ENV === 'production'
    ? require('sqlite3')
    : // production環境以外は冗長モードを利用
      require('sqlite3').verbose();

// todo-data-storage/sqlite/sqliteというファイルにデータベースの状態を保存
const db = new sqlite3.Database(join(__dirname, 'sqlite'));

// コールバックパターンのメソッドをPromise化
const dbGet = promisify(db.get.bind(db));

const dbRun = function () {
  return new Promise((resolve, reject) =>
    db.run.apply(db, [
      ...arguments, // dbRun関数に渡された引数が入ってくる
      function (err) {
        err ? reject(err) : resolve(this);
      },
    ])
  );
};

const dbAll = promisify(db.all.bind(db));

dbRun(`CREATE TABLE IF NOT EXISTS todo (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL
  )`).catch((err) => {
  // テーブル作成に失敗した場合はアプリケーションを終了
  console.error(err);
  process.exit(1);
});

function rowToTodo(row) {
  return { ...row, completed: !!row.completed };
}

exports.fetchAll = () =>
  dbAll('SELECT * FROM todo').then((rows) => rows.map(rowToTodo));

// SQL インジェクション防止のため動的プレースホルダを利 用します。
exports.fetchByCompleted = (completed) =>
  dbAll(`SELECT * FROM todo WHERE completed = ?`, completed).then((rows) =>
    rows.map(rowToTodo)
  );

exports.create = async (todo) => {
  await dbRun(
    'INSERT INTO todo VALUES (?,?,?)',
    todo.id,
    todo.title,
    todo.completed
  );
};

exports.update = (id, update) => {
  const setColums = [];
  const values = [];
  for (const column of ['title', 'completed']) {
    if (column in update) {
      setColums.push(`${column} = ?`);
      values.push(update[column]);
    }
  }
  values.push(id);
  return dbRun(
    `UPDATE todo SET ${setColums.join()} WHERE id = ?`,
    values
  ).then(({ changes }) =>
    changes === 1 ? dbGet('SELECT * FROM todo WHERE id = ?', id) : null
  );
};

exports.remove = (id) =>
  dbRun('DELETE FROM todo WHERE id = ?', id).then(({ changes }) =>
    changes === 1 ? id : null
  );
