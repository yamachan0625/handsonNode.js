'use strict';
const { Worker, threadId } = require('worker_threads');

console.log('メインスレッド', threadId);

const cpuCOunt = require('os').cpus().length;

for (let i = 0; i < cpuCOunt; i++) {
  // サブスレッドで実行するファイルのパスを指定してWorkerをnew
  const worker = new Worker(`${__dirname}/web-app.js`);
  console.log('サブスレッド', worker.threadId);
}
