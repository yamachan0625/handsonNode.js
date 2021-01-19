'use strict';
const express = require('express');
const { v4: uuidv4 } = require('uuid');
// 実行されたスクリプトの名前に応じてデータストレージの実装を使い分ける
const dataStorage = require(`./${process.env.npm_lifecycle_event}`);

const app = express();

app.use(express.json());

app.get('/api/todos', (req, res, next) => {
  if (!req.query.completed) {
    return dataStorage.fetchAll().then((todos) => res.json(todos), next);
  }
  // completedクエリパラメータを指定された場合はToDoをフィルタリング
  const completed = req.query.completed === 'true';
  dataStorage
    .fetchByCompleted(completed)
    .then((todos) => res.json(todos), next);
});

// ToDoの新規登録
app.post('/api/todos', (req, res, next) => {
  const { title } = req.body;
  if (typeof title !== 'string' || !title) {
    // titleがリクエストに含まれない場合はステータスコード400(Bad Request)
    const err = new Error('title is required');
    err.statusCode = 400;
    return next(err); // 次のハンドラ(エラーハンドラ)に処理を委譲する
  }
  // ToDoの作成
  const todo = { id: uuidv4(), title, completed: false };
  dataStorage.create(todo).then(() => res.status(201).json(todo), next);
});

function completedHandler(completed) {
  return (req, res, next) =>
    dataStorage.update(req.params.id, { completed }).then((todo) => {
      if (todo) {
        return res.json(todo);
      }
      const err = new Error('Todo not found');
      err.statusCode = 404;
      next(err);
    });
}

// ToDoのCompletedの設定、解除
app
  .route('/api/todos/:id/completed')
  .put(completedHandler(true))
  .delete(completedHandler(false));

app.delete('/api/todos/:id', (req, res, next) => {
  dataStorage.remove(req.params.id).then((id) => {
    if (id !== null) {
      return res.status(204).end();
    }
    const err = new Error('ToDo not found');
    err.statusCode = 404;
    next(err);
  }, next);
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('エラーハンドリング', err);
  res.status(err.statusCode || 500).json({ error: err.message });
});

app.listen(3000);

const dbRun3 = function () {
  return new Promise((resolve, reject) => {
    console.log('aaaaaaaaa', ...arguments);
    db.run.apply(db, [
      ...arguments,
      function (err) {
        err ? reject(err) : resolve(this);
      },
    ]);
  });
};
