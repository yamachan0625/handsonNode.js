'use strict';
const http = require('http');
const fibonacci = require('./fibonacci');

http
  .createServer((req, res) => {
    // http://localhost:3000/10 へのリクエストではreq.urlは'/10'になるので、
    // そこから1文字目を取り除いてnを取得する
    const n = Number(req.url.substr(1));
    if (Number.isNaN(n)) {
      // Number.isNaN()で数値かどうか判定し、数値でなかった場合は無視
      return res.end();
    }
    const result = fibonacci(n);
    // res.end()で計算結果をレスポンスとして返す
    res.end(result.toString());
  })
  .listen(3001); // 3000ポートでリクエストを待機

// 並行度(100)と時間(10秒)を指定してloadtestを実行
// npx loadtest -c 100 -t 10 http://localhost:3000/30
