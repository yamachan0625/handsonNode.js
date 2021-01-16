'use strict';
const { fork, setupMaster } = require('cluster');

console.log('メインプロセス', process.pid);

// サブプロセスが実行するファイルの指定
setupMaster({ exec: `${__dirname}/web-app` });

// CPUコアの数だけプロセスをフォーク
const cpuCount = require('os').cpus().length;
for (let i = 0; i < cpuCount; i++) {
  // sub: cluster.Workerインスタンス
  const sub = fork(); //cluster.fork()によってフォクされたサブプロセス同士はポートを共有できる
  console.log('サブプロセス', sub.process.pid);
  // IPCでサブプロセスにポート番号を送信
  sub.send(3001); //送信
  // IPCで受信したメッセージをハンドリング
  sub.on('message', (
    // 受信
    { pid, response }
  ) => console.log(`${pid}が${response}を返します`));
}

// http://localhost:3001/10
// 55694が55を返します (サブプロセスからメインプロセスへのメッセージ送信)
