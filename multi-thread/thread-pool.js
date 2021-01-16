'use strict';
const { Worker } = require('worker_threads');

module.exports = class ThreadPool {
  // 空きスレッド、キューを初期化
  availableWorkers = [];
  queue = [];
  constructor(size, filePath, options) {
    // 引数で指定されたとおりにスレッドを生成してプール
    for (let i = 0; i < size; i++) {
      this.availableWorkers.push(new Worker(filePath, options));
    }
  }

  // 外部からの処理要求を受け付けるメソッド
  excuteInThread(arg) {
    return new Promise((resolve) => {
      const request = { resolve, arg };
      // 空きスレッドがあればリクエストを処理し、なければキューに積む
      const worker = this.availableWorkers.pop();
      worker ? this.#process(worker, request) : this.queue.push(request);
    });
  }

  // 実際にスレッドで処理を実行するprivateメソッド
  #process(worker, { resolve, arg }) {
    // 2.サブスレッド(今回の場合fibonacci.js)から送信された値を受信
    worker.once('message', (result) => {
      //第二引数の引数に返されたデータが入ってくる
      console.log(result);
      // リクエスト元に結果を返す
      resolve(result);

      // キューに積まれたリクエストがあれば処理し、なければ空きスレッドに戻す
      const request = this.queue.shift();
      request
        ? this.#process(worker, request)
        : this.availableWorkers.push(worker);
    });
    // 1.worker(今回の場合fibonacci.js)にpostMessageメソッドで値を送信
    worker.postMessage(arg);
  }
};
