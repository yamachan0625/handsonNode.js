'use strict';
module.exports = function fibonacci(n) {
  // nが1以下の場合はnを、それ以外の場合は直前の2つのフィボナッチ数の和を返す
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};

const { workerData, parentPort } = require('worker_threads');
const fibonacci = require('../cluster/fibonacci');

// messageイベントの監視によりメインスレッドからのメッセージの受信を待機、
// 受信したらフィボナッチ数を計算して結果をメインスレッドに送信
parentPort.on('message', (n) => parentPort.postMessage(fibonacci(n)));

// プールできていないコード
// parentPort.postMessage(fibonacci(workerData))
