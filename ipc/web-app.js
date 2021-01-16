'use strict';
const http = require('http');
const fibonacci = require('./fibonacci');
const pid = process.pid;

process.on('message', (port) => {
  console.log(pid, `ポート${port}でwebサーバーを起動します`);
  http
    .createServer((req, res) => {
      // http://localhost:3000/10 へのリクエストではreq.urlは'/10'になるので、
      // そこから1文字目を取り除いてnを取得する
      const n = Number(req.url.substr(1));
      if (Number.isNaN(n)) {
        // Number.isNaN()で数値かどうか判定し、数値でなかった場合は無視
        return res.end();
      }
      const response = fibonacci(n);
      // 結果をIPC(プロセス間通信)で送信
      process.send({ pid, response });
      res.end(response.toString());
    })
    .listen(port); // 3001ポートでリクエストを待機
});
