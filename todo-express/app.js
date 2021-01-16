'use strict';
const express = require('express');

let todos = [
  { id: 1, title: 'ネーム', completed: false },
  { id: 2, title: '下書き', completed: true },
];

const app = express();
app.use(express.json());
app.get('/api/todos', (req, res) => {
  if (!req.query.completed) {
    return res.json(todos);
  }
  // completedクエリパラメータを指定された場合はToDoをフィルタリング
  const completed = req.query.completed === 'true';
  res.json(todos.filter((todo) => todo.completed === completed));
});

// ToDoのIDの値を管理するための変数
let id = 2;
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
  const todo = { id: ++id, title, completed: false };
  todos.push(todo);

  // ステータスコード201(Created)で結果を返す
  res.status(201).json(todo);
});

// 指定されたIDのToDoを取得するためのミドルウェア
app.use('/api/todos/:id(\\d+)', (req, res, next) => {
  const targetId = Number(req.params.id); // req.params に含まれるプロパティは文字列のため、Number で数値に変換す
  const todo = todos.find((todo) => todo.id === targetId);
  if (!todo) {
    const err = new Error('Todo not found');
    err.statusCode = 404;
    next(err);
  }
  req.todo = todo;
  next();
});

// ToDoのCompletedの設定、解除
app
  .route('/api/todos/:id(\\d+)/completed')
  .put((req, res) => {
    req.todo.completed = true;
    res.json(req.todo);
  })
  .delete((req, res) => {
    req.todo.completed = false;
    res.json(req.todo);
  });

app.delete('/api/todos/:id(\\d+)', (req, res) => {
  todos = todos.filter((todo) => todo !== req.todo);
  res.status(204).end(); // 中身を指定せずに完了する事で、からのレスポンスを返す
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('エラーハンドリング', err);
  res.status(err.statusCode || 500).json({ error: err.message });
});

app.listen(3001);

// Next.jsによるルーティングのためこれ以降を追記
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });

nextApp.prepare().then(() => {
  app.get('*', nextApp.getRequestHandler()),
    (err) => {
      console.error(err);
      process.exit(1);
    };
});

// await fetch('http://localhost:3001/api/todos', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ title: 'ペン入れ' }),
// });
// 201, { id: 3, title: 'ペン入れ', completed: false };

// await fetch('http://localhost:3001/api/todos')
// [
//   { id: 1, title: 'ネーム', completed: false },
//   { id: 2, title: '下書き', completed: true },
//   { id: 3, title: 'ペン入れ', completed: false },
// ];
