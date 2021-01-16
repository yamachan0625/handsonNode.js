'use strict';
const fibonacci = require('../multi-thread/fibonacci');
// workerDataでInt32Arrayインスタンスを受け取る
const { workerData: int32Array, parentPort } = require('worker_threads');

parentPort.on('message', (n) => {
  parentPort.postMessage(fibonacci(n));
  // 処理のたびに最初の値をインクリメントする
  // Atomics.add()でint32Arrayの0番目の値に1を足す
  // Atomics.add()は第一引数に更新対象のTypedArrayインスタンス、第二引数に更 新する配列上の位置、第三引数に足す値を指定します。
  Atomics.add(int32Array, 0, 1);
});
