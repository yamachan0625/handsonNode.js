'use strict';
const { Socket } = require('dgram');
const http = require('http');
const next = require('next');
const Server = require('socket.io');

let todos = [
  { id: 1, title: 'ネーム', completed: false },
  { id: 2, title: '下書き', completed: true },
];

// ToDoのIDの値を管理するための変数
let id = 2;

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });

nextApp.prepare().then(
  () => {
    // Next.jsのリクエストハンドラを引数にhttp.createServer()を実行
    const server = http.createServer(nextApp.getRequestHandler()).listen(3001);

    const io = Server(server);
    // /todos名前空間で接続待機
    const ioTodos = io.of('/todos');
    // 新しいクライアントからの接続に伴うconnectionイベント
    ioTodos.on('connection', (socket) => {
      console.log('connected');
      // 接続したクライアントにToDo一覧を送信
      console.log(todos);
      socket.emit('todos', todos);
      // 接続したクライアントからの各種イベントに対応
      socket
        .on('createTodo', (title) => {
          if (typeof title !== 'string' || !title) {
            return;
          }
          const todo = { id: (id += 1), title, completed: false };
          todos.push(todo);
          // この名前空間に接続する全クライアントにデータを送信
          ioTodos.emit('todos', todos);
        })
        // ToDoのcompletedの更新
        .on('updateCompleted', (id, completed) => {
          todos = todos.map((todo) => {
            return todo.id === id ? { ...todo, completed } : todo;
          });
          // この名前空間に接続する全クライアントにデータを送信
          ioTodos.emit('todos', todos);
        })
        .on('deleteTodo', (id) => {
          todos = todos.filter((todo) => todo.id !== id);
          // この名前空間に接続する全クライアントにデータを送信
          ioTodos.emit('todos', todos);
        });
    });
  },
  (err) => {
    console.log(err);
    process.exit(1);
  }
);
