// 'use strict';
// const http = require('http');
// const { Worker } = require('worker_threads');

// http
//   .createServer((req, res) => {
//     const n = Number(req.url.substr(1));
//     if (Number.isNaN(n)) return res.end();
//     // コンストラクタの第二引数で値を渡しつつサブスレッドを生成
//     new Worker(`${__dirname}/fibonacci.js`, {
//       workerData: n,
//     }).on('message', (result) => res.end(result.toString()));
//   })
//   .listen(3001);

'use strict';
const http = require('http');
const ThreadPool = require('./thread-pool');
const cpuCount = require('os').cpus().length;

const threadPool = new ThreadPool(cpuCount, `${__dirname}/fibonacci.js`);

http
  .createServer(async (req, res) => {
    const n = Number(req.url.substr(1));
    if (Number.isNaN(n)) return res.end();

    const result = await threadPool.excuteInThread(n);
    res.end(result.toString());
  })
  .listen(3001);
