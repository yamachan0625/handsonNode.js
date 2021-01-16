// 転送
//　postMessage() や Worker のインスタンス化時に転送対象のオブジェクトを指定 すると、
// そのオブジェクトはコピーされることなく他スレッドに渡され、それに伴い所 有権も譲渡されます
'use strict';
const { parentPort, workerData } = require('worker_threads');

parentPort.postMessage(
  workerData.buffer,
  // postMessage()の第二引数に転送対象オブジェクトを指定
  workerData.transfer ? [workerData.buffer] : []
);

function useMaybeTransfer(transfer) {
  // 1 GBのArrayBufferを生成
  const buffer = new ArrayBuffer(1024 * 1024 * 1024);
  // 現在時刻を記録
  const start = perf_hooks.performance.now();
  new worker_threads.Worker('./maybe-transfer.js', {
    workerData: { buffer, transfer },
    // transferListプロパティに転送対象オブジェクトを指定
    transferList: transfer ? [buffer] : [],
  }).on('message', (result) => {
    console.log({ result });
    // サブスレッドから値が戻ってくるまでにかかった時間を出力
    console.log(perf_hooks.performance.now() - start);
  });
  // サブスレッドに渡した値がどう見えるか確認
  console.log({ buffer });
}
// # 転送を利用する場合
// > useMaybeTransfer(true)
// ArrayBuffer { (detached), byteLength: 0 } undefined
// > 64.41930799931288
// # 転送を利用しない場合
// > useMaybeTransfer(false) ArrayBuffer {
// # ...(省略)
// byteLength: 1073741824 }
// undefined
// > 3755.7365990057588
